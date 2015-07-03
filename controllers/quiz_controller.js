var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizID
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }else{
        next(new Error ('No existe quizId=' + quizId));
      }
    }
  ).catch(
    function(error) {next(error);}
  );
};

//GET /quizes
exports.index = function(req, res){
  console.log("Entro index :" + req.query.search);
  var buscar;

  if (req.query.search!=undefined){
      buscar = '%' + req.query.search.replace(/[ ]/g,'%') + '%';
  }else{
    buscar = '';
  }
  models.Quiz.findAll({where:{pregunta:{like:buscar}},order:[['pregunta', 'ASC']]}).then(function(quizes){
    console.log("quizez count " + quizes.length);
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  })
};

//GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
  })
};

//GET /quizes/answer
exports.answer = function(req,res){
  models.Quiz.find(req.params.quizId).then(function(quiz) {

    var resultado = 'Incorrecto';
    if(req.query.respuesta === req.quiz.respuesta){
      resultado='Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});

  })

};
exports.new = function(req,res){
  var quiz = models.Quiz.build(
    {pregunta:"Pregunta",respuesta:"Respuesta"} //Crea objeto quiz
  );
  res.render('quizes/new',{quiz: quiz, errors: []});
};
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);
  console.log("Entro en create : "+  JSON.stringify(req.body.quiz));
  //Guarda en BD los campos pregunta y respuesta de quiz
  quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new',{quiz: quiz, errors: err.errors});
      }else{
        quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
          res.redirect('/quizes');
        }) //Redirección HTTP (URL relativo) lista de preguntas
      }
    }
  );
};
