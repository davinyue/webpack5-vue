const cached = {};
export default (model) => {
  if (!cached[model.namespace]) {
    window.app.model(model);
    cached[model.namespace] = true;
  }
};
