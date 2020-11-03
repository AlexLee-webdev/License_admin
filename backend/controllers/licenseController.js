const License = require("../models/license");
// const User = require("../models/user");

exports.findAll = async(req, res) => {
  try {
    const items = await License.find({ });
    res.json({
      message: true,
      data: items
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: false,
    });
  }
}

exports.getRequestPending = async (req, res) => {
  try {
    License.count({ status: false }, function (err, count) {
      total = count;
      res.json({ message: true, data: count });
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: false,
    });
  }
};

exports.create = async(req, res) => {
  var token = req.headers.authorization;

  try {
    var obj = {
      name: req.body.data.name,
      email: req.body.data.email,
      mid: req.body.data.mid,
      serial: "",
      expiry: req.body.data.expiry,
      status: false,
      reqTime: new Date()
    };
    let item = new License(obj);
    item.save()
    .then(data => {
        res.json({message: true});
    })
    .catch(err => {
        console.log('\x1b[31m' + err.message);
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the finance."
        });
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: false,
    });
  }
}

exports.update = async(req, res) => {
  // console.log('headers:', req.headers);
  const id = req.body.data.id;

  License.findOne({_id: id})
  .then(data => {
    if (!data)
        res.status(404).send({ message: "Not found item"});
    else {
      data.serial = "test";
      data.status = true;
      data.save();
      
      res.json({message: true});
    }
  })
  .catch(err => {
    res
    .status(500)
    .send({ message: "Error retrieving user"});
  });        
}

