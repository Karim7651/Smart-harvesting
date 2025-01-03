class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    //exclude pagination, sorting, numberOfResults, from queryObj
    const excludedFields = ["page","search", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    //build query then execute query by using await

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // api/v1/products?duration[gte]=5&difficulty=easy
    //{difficulty : 'easy', duration : {$gte : 5}}
    //req.query looks like this => {difficulty : 'easy', duration : {gte : 5}} missing the dollar
    //this regex adds $ to inequality operators
    //\b /b : looks for exact matches, /g : replace
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    //return entire query object so we can chain more functions
    return this;
  }
  search() {
    if (this.queryString.search) {
      // Perform a case-insensitive search for names containing the search term
      const searchQuery = this.queryString.search;
      this.query = this.query.find({
        name: { $regex: searchQuery, $options: 'i' } // Case-insensitive and search anywhere in the name
      });
    }
  
    // Return the query object to allow chaining
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // api/v1/tours?sort=price (ascending by default) | api/v1/tours?sort=-price(descending)
      // api/v1/tours?sort=-price,ratingAverage
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
      //default sorting by createdAt(newest first)
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      //exclude mongoose internal field __v
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; //*1 => to string
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
export default APIFeatures;