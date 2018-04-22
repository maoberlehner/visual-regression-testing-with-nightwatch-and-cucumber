const { client } = require(`nightwatch-cucumber`);
const fs = require(`fs`);
const path = require(`path`);
const tmp = require(`tmp`);

const { compare, imagePath } = require(`../helpers/image-diff`);
const { When, Then } = require(`../helpers/step`);

// This is the (temporary) directory where we save the
// screenshots of the current representation of the page.
const currentDirectory = tmp.dirSync().name;
// Reference screenshots are saved in this directory
// you absolutely should add this directory to version control.
const referenceDirectory = path.resolve(__dirname, `..`, `visual-reference`);

When(/^I look at (.*?)$/, (name) => {
  const referenceRun = process.argv.includes(`visual-regression-reference`);

  const currentImage = imagePath({ base: currentDirectory, name });
  const referenceImage = imagePath({ base: referenceDirectory, name });

  // If no reference image exists yet, a new one is created.
  if (referenceRun || !fs.existsSync(referenceImage)) {
    // eslint-disable-next-line no-console
    console.info(`INFO: Reference image successfully created: ${referenceImage}`);
    client.saveScreenshot(referenceImage);
  }

  return client.saveScreenshot(currentImage);
});

Then(/^I expect (.*?) to look the same as before$/, async (name) => {
  const currentImage = imagePath({ base: currentDirectory, name });
  const referenceImage = imagePath({ base: referenceDirectory, name });

  // If the images match, the test succeeds, else it fails.
  return compare({ currentImage, name, referenceImage });
});
