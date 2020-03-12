const core = require("@actions/core");
const NetlifyAPI = require("netlify");
const { exec } = require("@actions/exec");

// Input Variables
let netlify = {};
netlify.access_token = core.getInput("netlify_access_token");
netlify.site_name = core.getInput("site_name");

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
      console.log(
        "Site with name " +
          netlify.site_name +
          " doesn't exist. Creating one now"
      );

      const site = await client.createSite({
        body: {
          name: netlify.site_name
        }
      });

      site_id = site.site_id;
      console.log("Successfully created site with name " + netlify.site_name);
    }

    console.log(
      "Deploying to site " + netlify.site_name + " with site_id " + site_id
    );

    await exec(`npm init`);
    await exec(`npm i netlify-cli`);

    await exec(
      `./node_modules/netlify-cli/bin/run deploy --prod --auth ${netlify.access_token} --site ${site_id}`,
      {
        listeners: {
          stdout: data => console.log(data.toString()),
          stderr: data => console.log(data.toString())
        }
      }
    );

    console.log(
      "Successfully deployed site to " + netlify.site_name + ".netlify.com"
    );

    core.setOutput(
      "Successfully deployed site to " + netlify.site_name + ".netlify.com"
    );
  } catch (err) {
    core.setFailed(err.toString());
  }
})();
