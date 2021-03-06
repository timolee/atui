import React from 'react';
import Layout from '../Layout';
import MainContent from './MainContent';
import Promise from 'bluebird';
import * as utils from '../utils';

export function collect(nextProps, callback) {

  console.log('nextProps', nextProps)
  //for atui
  const componentsList = utils.collectDocs(nextProps.data.src.components);
  const weigetList = utils.collectDocs(nextProps.data.src.widgets);

  const pathname = nextProps.location.pathname;
  let moduleDocs;
  if (/(docs\/atui\/)|(components\/)|(changelog)/i.test(pathname)) {
    moduleDocs = [
      ...utils.collectDocs(nextProps.data.docs.atui),
      ...componentsList,
      /* eslint-disable new-cap */
      nextProps.data.CHANGELOG(),
      /* eslint-enable new-cap */
    ];
  } else if(/(docs\/widgets\/)|(widgets\/)/i.test(pathname)) {
    moduleDocs = [
      ...utils.collectDocs(nextProps.data.docs.widgets),
      ...weigetList,
       // eslint-disable new-cap
      // nextProps.data.CHANGELOG(),
      /* eslint-enable new-cap */
    ];
  } else {
    moduleDocs = utils.collectDocs(
      nextProps.utils.get(nextProps.data, pathname.split('/').slice(0, 2))
    );
  }

  const demos = nextProps.utils.get(nextProps.data, [...pathname.split('/'), 'demo']);

  const promises = [Promise.all(componentsList), Promise.all(moduleDocs)];
  if (demos) {
    promises.push(Promise.all(
      Object.keys(demos).map((key) => demos[key]())
    ));
  }
  Promise.all(promises)
    .then((list) => {
       callback(null, {
        ...nextProps,
        components: list[0],
        moduleData: list[1],
        demos: list[2],
      })
     });
}

export default (props) => {
  return (
    <Layout {...props}>
      <MainContent {...props} />
    </Layout>
  );
};
