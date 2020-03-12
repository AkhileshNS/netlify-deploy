const NetlifyAPI = require("netlify");
const path = require("path");

let name = "akhileshns.demosite";
name = name.replace(/\./g, "-");

(async function() {
  try {
    console.log(name);

    const client = new NetlifyAPI(process.env.NETLIFY_ACCESS_TOKEN);

    const sites = await client.listSites();

    let site_id = "";
    sites.forEach(({ name: Name, site_id: Site_id }) => {
      if (Name === name) {
        site_id = Site_id;
      }
    });

    if (site_id === "") {
      try {
        const site = await client.createSite({
          body: {
            name
          }
        });

        site_id = site.site_id;
      } catch (e) {
        // Error: Break;
        console.error("Sitename not available");
      }
    }

    await client.deploy(site_id, "./demosite", {
      configPath: "./demosite/netlify.toml"
    });

    console.log("Successfully deployed sites");
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
})();

// console.log(path.join("C:\\_WORKING\\Development\\netlify-deploy", "."));

// console.log(
//   path.join("C:\\_WORKING\\Development\\netlify-deploy", "./node_modules")
// );
