const mongoose = require('mongoose');
const schema = mongoose.Schema;

const activityShema = schema({
    authorId: { 
      type: schema.Types.ObjectId, 
      ref: 'user', 
      required: true },

    name: {
        type: String,
        required: [true, 'Veuillez renseigner le nom'],
        trim: true,
      },
    picture: {
        type: String,
      },
    video: {
        type: String,
      },
    category: {
        type: [String],
        enum: ['Jeux sportifs','Activités en plein air','Jeux d\'intérieur','Jeux d\'intérieur calme','Jeux de rôle','Jeux coopératifs',
               'Activités manuelles','Jeux créatifs','Jeux d\'adresse','Jeux de réflexion','Jeux sensoriels',
               'Jeux de motricité','Jeux de société','Jeux de connaissances','Jeux d\'équipe','Jeux de coordination',
               'Activités scientifique','Jeux de concentration'],
      },
    age: {
        type: String,
        enum: ['3-5 ans', '6-8 ans', '9-11 ans', '12-14 ans', '15-17 ans'],
      },
    size: {
        type: Number,
      },  
    duration: {
        type: String,
        enum: ['Moin de 15min', '15min à 30min', '30min à 1h', '1h à 2h', 'Demi journée', 'Journée ou +'],
      },     
    place: {
        type: String,
        trim: true,
      }, 
    objective: {
        type: String,
        trim: true,
      },
    material: {
        type: String,
        trim: true,
      },
    planning: {
        type: String,
        trim: true,
      },
    progress: {
        type: String,
        trim: true,
      },
    conclusion: {
        type: String,
        trim: true,
      },
    likers: {
        type: [String],
    },
    comments: {
        type: [
            {
                commenterId: String,
                commenterAuthor: String,
                text: String,
                timestamp: Number,

            }
        ],
    },
},
{ timestamps: true });



const Activity = mongoose.model('activities', activityShema);

module.exports = Activity;