// Constructors and object instances
function APIfeatures(query, queryString, params) {
  this.query = query; // Products.find()
  this.queryString = queryString; // req.query
  this.params = params;
  this.paginating = () => {
    const page = +this.queryString.pageIndex || 1;
    const limit = +this.queryString.pageSize || 12;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);
    return this;
  };
  this.sorting = () => {
    const sortBy = this.queryString.orderBy || "createdAt";
    const direction = this.queryString.orderDirection || 'desc';
    this.query = this.query
      .sort({ [sortBy]: direction === 'desc' ? -1 : 1 })
    // .populate("categories");
    return this;
  };

  this.searching = () => {
    const search = this.queryString.keyword;
    if (search) {
      this.query = this.query.find({
        $or: {
          name: {
            $regex: search,
            $options: 'i'
          },
          username: {
            $regex: search,
            $options: 'i'
          },
          fullname: {
            $regex: search,
            $options: 'i'
          },
          email: {
            $regex: search,
            $options: 'i'
          },
        }

      });
    } else {
      this.query = this.query.find();
    }
    return this;
  };

  this.filtering = () => {
    const queryObj = this.queryString;

    if (queryObj.color) {
      this.query = this.query.find({
        $or: [{ color: { $regex: queryObj.color } }],
      });
    } else {
      this.query = this.query.find();
    }

    return this;
  };
  this.getDiscount = () => {
    this.query = this.query.find(
      {
        discount: {
          $gt: 0
        }
      }
    )
    return this;
  }
}

module.exports = { APIfeatures };
