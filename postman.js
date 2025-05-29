// postman.js

const Postman = {
  getPagePath(page) {
    return `pages/${page}.html`;
  },

  getScriptPath(page) {
    return `js/${page}.js`;
  },

  getComponentPath(name) {
    return `components/${name}.html`;
  }
};
