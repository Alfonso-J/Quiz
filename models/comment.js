module.exports = function(sequelize,DataTypes){
  return sequelize.define(
    'Comments',
    {
      texto:{
        type: DataTypes.STRING,
        validate:{notEmpty:{msg: "-> Falta Comentario"}}
      },
      publicado:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
        }
    }
  );
}