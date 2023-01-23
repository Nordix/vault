import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class PkiConfigurationCreateRoute extends Route {
  @service secretMountPath;
  @service store;
  @service pathHelp;

  beforeModel() {
    // pki/urls uses openApi to hydrate model
    return this.pathHelp.getNewModel('pki/urls', this.secretMountPath.currentPath);
  }

  model() {
    return hash({
      config: this.store.createRecord('pki/action'),
      urls: this.getOrCreateUrls(this.secretMountPath.currentPath),
    });
  }

  setupController(controller, resolvedModel) {
    super.setupController(controller, resolvedModel);
    const backend = this.secretMountPath.currentPath || 'pki';
    controller.breadcrumbs = [
      { label: 'secrets', route: 'secrets', linkExternal: true },
      { label: backend, route: 'overview' },
      { label: 'configure' },
    ];
  }

  async getOrCreateUrls(backend) {
    try {
      return this.store.findRecord('pki/urls', backend);
    } catch (e) {
      return this.store.createRecord('pki/urls', { id: backend });
    }
  }
}
