const mongoose = require('mongoose');
const { AutoIncrementID } = require('@typegoose/auto-increment');
const bcrypt = require('bcryptjs');
const R = require('ramda');

const { Schema } = mongoose;

const userSchema = new Schema({
  user: Number,
  username: { type: String, lowercase: true, required: true, unique: true, immutable: true },
  username_case: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  email_verification_token: { type: String },
  password: { type: String, required: true },
  profile_pic: { type: String },
  first_name: { type: String, maxlength: 20 },
  last_name: { type: String, maxlength: 20 },
  bio: { type: String, maxlength: 240 },
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date },
  studio : [{
    name: { type: String },
    type: { type: String },
    token_id : { type: String, default: '222222' },
    training : { type: Boolean, default: false },
    finished : { type: Boolean, default: false },
    inference : { type: Boolean, default: false },
    images : [{ type: String }],
    Time : { type: Date, default: Date.now, immutable: true },
    prompts: {
      type: [{ type: String }],
      default: [
          `photo of xxxx looking left, classic, old styles, insane details`,
          `photo of xxxx as astronaut, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `photo of xxxx as Military Leader, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `High detail RAW color art, animation, xxxx as Thorin Oakenshield from LOTR, (inside the mountain dwarven halls), ((Dwarf king)), ((((crown on head whit Arkenstone)))) Black leather armor, ((dirty Black long curly hair)) huge black wolf fur collar ((against the background of gold placers smaug dragon)) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `photo of xxxx as astronaut, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `High detail RAW color art, animation, xxxx as Bilbo Baggins from LOTR, (hobbit of the Shire), ((against the background of gold placers smaug dragon)) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `photo of xxxx as Military Leader, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `photo of xxxx as Flight Attendant, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
          `portrait of xxxx, looking to camera, insane details, city, 4k`,
          `selfie of xxxx, insane details, 4k, realistic`,
          `Old xxxx with wrinkles face looking left, (stylish hairstyle:1.3), gray hair, clear facial features, piercing gaze, (military clothes:1.2), intricate details), epic, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski`
      ],
    },
  }]
}, { versionKey: false });

userSchema.plugin(AutoIncrementID, {
  field: 'user',
  incrementBy: 1,
  startAt: 1,
  trackerCollection: 'counters',
  trackerModelName: 'User',
});

userSchema.virtual('full_name').get(function() {
  if (this.first_name && this.last_name) {
    return `${this.first_name} ${this.last_name}`;
  }
  if (this.first_name && !this.last_name) {
    return this.first_name;
  }
  if (!this.first_name && this.last_name) {
    return this.last_name;
  }
  return undefined;
});

userSchema.virtual('initials').get(function() {
  return this.first_name && this.last_name && `${this.first_name[0].concat(this.last_name[0]).toUpperCase()}`;
});

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err1, salt) => {
      if (err1) { reject(err1); }
      bcrypt.hash(this.password, salt, (err2, hash) => {
        if (err2) { reject(err2); }
        this.password = hash;
        resolve(hash);
      });
    });
  });
};

userSchema.methods.hidePassword = function() {
  return R.omit(['password', '_id'], this.toObject({ virtuals: true }));
};

const User = mongoose.model('User', userSchema);

module.exports = User;
