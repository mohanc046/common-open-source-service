
module.exports = app => {
  
    app.use('/v1/gstin', require('../modules/v1/gstin/routes/index'));
  
  }