const Generator = require("yeoman-generator");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const isdir = new fs.Dirent();

const readfile = (answers, tem_path, out_path) => {
  fs.readdir(tem_path, (err, files) => {
    files.forEach((file) => {
      fs.stat(path.join(tem_path, file), (err, status) => {
        if (status.isDirectory()) {
          fs.mkdirSync(path.join(out_path, file));
          readfile(
            answers,
            path.join(tem_path, file),
            path.join(out_path, file)
          );
        } else {
          ejs.renderFile(path.join(tem_path, file), answers, (err, result) => {
            fs.writeFileSync(path.join(out_path, file), result);
          });
        }
      });
      // console.log("是否为目录", isdir.isDirectory("views"));
      // if (isdir.isDirectory(file)) {
      //   fs.mkdirSync(path.join(out_path, file));
      //   readfile(answers, path.join(tem_path, file), path.join(out_path, file));
      // } else {
      //   ejs.renderFile(path.join(tem_path, file), answers, (err, result) => {
      //     fs.writeFileSync(path.join(out_path, file), result);
      //   });
      // }
    });
  });
};

// console.log(answers);

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name ",
        default: this.appname,
      },
    ]).then((answers) => {
      const tem_path = path.join(__dirname, "templates");
      const out_path = process.cwd();
      readfile(answers, tem_path, out_path);
    });
  }
};
