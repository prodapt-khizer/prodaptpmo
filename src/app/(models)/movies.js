import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const Movies =
  mongoose.models.movies ||
  mongoose.model(
    "movies",
    new Schema({
      plot: String,
      genres: Array,
      runtime: Number,
      cast: Array,
      poster: String,
      title: String,
      fullplot: String,
      countries: Array,
      released: Date,
      directors: Array,
      writers: Array,
      awards: Object,
      lastupdated: String,
      year: Number,
      imdb: Object,
      type: String,
      tomatoes: Object,
      num_mflix_comments: Number,
    })
  );

export default Movies;
