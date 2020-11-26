Dummy change
<div id="header" align="center">

[![Eclipse Che - Eclipse Next-Generation IDE](https://raw.githubusercontent.com/eclipse/che/assets/eclipseche.png)](
https://www.eclipse.org/che/)

**Next-generation container development platform, developer workspace server and cloud IDE**

[![Eclipse License](https://img.shields.io/badge/license-Eclipse-brightgreen.svg)](https://github.com/codenvy/che/blob/master/LICENSE)
[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-che-che-build-master)](https://ci.centos.org/view/Devtools/job/devtools-che-che-build-master/)
<a href="https://sonarcloud.io/dashboard?id=org.eclipse.che%3Ache-parent%3Amaster">
<img src="https://sonarcloud.io/images/project_badges/sonarcloud-black.svg" width="94" height="20" href="" />
</a>

*Che is Kubernetes-native and places everything the developer needs into containers in Kube pods including dependencies, embedded containerized runtimes, a web IDE, and project code. This makes workspaces distributed, collaborative, and portable to run anywhere Kubernetes runs ... [Read More](https://www.eclipse.org/che/features/)*

</div>

![Eclipse Che](https://raw.githubusercontent.com/eclipse/che/assets/screenshoft_che7-quarkus-demo.png)

---

**Visit website at: https://www.eclipse.org/che/** and documentation at: https://www.eclipse.org/che/docs

- [**Getting Started**](#getting-started)
- [**Using Eclipse Che**](#using-eclipse-che)
- [**Feedback and Community**](#feedback-and-community)
- [**Contributing**](#contributing)
- [**Roadmap**](#roadmap)
- [**License**](#license)

---

### Getting Started
Here you can find links on how to get started with Eclipse Che:
- [Use Eclipse Che online](https://www.eclipse.org/che/getting-started/cloud/)
- [Run Eclipse Che on your own K8S cluster](https://www.eclipse.org/che/docs/che-7/che-quick-starts)


### Using Eclipse Che
Here you can find references to useful documentation and hands-on guides to learn how to get the most of Eclipse Che:
- [Customize Che workspaces for your projects](https://www.eclipse.org/che/docs/che-7/configuring-a-workspace-using-a-devfile/)
- [Run VSCode Extensions in Che workspaces](https://www.eclipse.org/che/docs/che-7/using-a-visual-studio-code-extension-in-che)
- [Configure Che for your teams](https://www.eclipse.org/che/docs/che-7/building-and-running-a-custom-registry-image/)


### Feedback and Community
We love to hear from users and developers. Here are the various ways to get in touch with us:
* **Support:** You can ask questions, report bugs, and request features using [GitHub issues](https://github.com/eclipse/che/issues).
* **Public Chat:** Join the public [eclipse-che](https://mattermost.eclipse.org/eclipse/channels/eclipse-che) Mattermost channel to discuss with community and contributors.
* **Twitter:** [@eclipse_che](https://twitter.com/eclipse_che)
* **Mailing List:** [che-dev@eclipse.org](https://accounts.eclipse.org/mailing-list/che-dev)
* **Weekly Meetings:** Join us in our [Che community meeting](https://github.com/eclipse/che/wiki/Che-Dev-Meetings) every second monday.


### Contributing
If you are interested in fixing issues and contributing directly to the code base:
- :bug: [Submitting bugs](https://github.com/eclipse/che/issues/new/choose)
- :page_facing_up: [Contributor license agreement](https://github.com/eclipse/che/wiki/Eclipse-Contributor-Agreement)
- :checkered_flag: [Development workflows](./CONTRIBUTING.md)
- :ok_hand: [Review source code changes](https://github.com/eclipse/che/pulls)
- :pencil: [Improve docs](https://github.com/eclipse/che-docs)
- :building_construction: [Che architecture](https://www.eclipse.org/che/docs/che-7/administration-guide/che-architecture-overview/)
- :octocat: [Che repositories](./CONTRIBUTING.md#other-che-repositories)
- :sparkles: [Good first issue for new contributors](https://github.com/eclipse/che/wiki/Labels#new-contributors)


#### Extending Eclipse Che
- [Add a new language support. (to be provided soon)](https://www.eclipse.org/che/docs/che-7/adding-support-for-a-new-language/)
- [Package your favorite VSCode extensions and make them available in Che.](https://www.eclipse.org/che/docs/che-7/using-a-visual-studio-code-extension-in-che/#publishing-a-vs-code-extension-into-the-che-plug-in-registry_using-a-visual-studio-code-extension-in-che)
- [Write your own VSCode extension that runs on a dedicated side car container.](https://www.eclipse.org/che/docs/che-7/what-is-a-che-theia-plug-in/)
- [Build and package your custom Che-Theia editor with your extensions and plugins.](https://www.eclipse.org/che/docs/che-7/using-alternative-ides-in-che/)

### Roadmap
We maintain the [Che roadmap](https://github.com/eclipse/che/wiki/Roadmap) in the open way. We welcome anyone to ask question and contribute to the roadmap by joining our [community meetings](https://github.com/eclipse/che/wiki/Che-Dev-Meetings).

## CI
The following [CentOS CI jobs](https://ci.centos.org/) are associated with the repository:

- [`master`](https://ci.centos.org/view/Devtools/job/devtools-che-che-build-master/) - builds and push Maven artifacts on each commit to the [`master`](https://github.com/eclipse/che/tree/master).
- [`nightly`](https://ci.centos.org/view/Devtools/job/devtools-che-che-nightly/) - builds and push Maven artifacts, builds CentOS images and pushes them to [quay.io](https://quay.io/organization/eclipse) on a daily basis from the [`master`](https://github.com/eclipse/che/tree/master) branch.
- [`release`](https://ci.centos.org/view/Devtools/job/devtools-che-che-release/) - builds and push Maven artifacts, builds images from the [`release`](https://github.com/eclipse/che/tree/release) branch. CentOS images are public and pushed to [quay.io](https://quay.io/organization/eclipse).

### License
Che is open sourced under the Eclipse Public License 2.0.
