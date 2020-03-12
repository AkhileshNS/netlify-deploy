const { execSync } = require("child_process");
const core = require("@actions/core");
const NetlifyAPI = require("netlify");

// Input Variables
let netlify = {};
netlify.access_token = core.getInput("netlify_access_token");
netlify.site_name = core.getInput("site_name");
netlify.folder_path = core.getInput("folder_path");
netlify.toml_path =
  core.getInput("toml_path") === ""
    ? core.getInput("folder_path") + "/netlify.toml"
    : core.getInput("toml_path");

(async function() {
  try {
    const client = new NetlifyAPI(netlify.access_token);

    const sites = await client.listSites();

    let site_id = "";
    sites.forEach(({ name, site_id: Site_id }) => {
      if (netlify.site_name === name) {
        site_id = Site_id;
      }
    });

    if (site_id === "") {
      const site = await client.createSite({
        body: {
          name: netlify.site_name
        }
      });

      site_id = site.site_id;
    }

    await client.deploy(site_id, netlify.folder_path, {
      configPath: netlify.toml_path
    });

    console.log(__dirname);
    console.log(execSync("ls -la"));

    core.setOutput(
      "Successfully deployed site to " + netlify.site_name + ".netlify.com"
    );
  } catch (err) {
    core.setFailed(err.toString());
  }
})();
