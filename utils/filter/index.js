const Category = require("../../models/Category");

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
        $or: [
          {
            name: {
              $regex: search,
              $options: 'i'
            }
          },
          // {
          //   username: {
          //     $regex: search,
          //     $options: 'i'
          //   },
          // },
          // {
          //   fullname: {
          //     $regex: search,
          //     $options: 'i'
          //   },
          // },
          // {
          //   email: {
          //     $regex: search,
          //     $options: 'i'
          //   },
          // }
        ]
      }
      );
    } else {
      this.query = this.query.find();
    }
    return this;
  };

  this.filtering = () => {
    const queryObj = this.queryString;
    this.query = this.query.find();
    if (queryObj.category) {
      this.query = this.query.find({
        $or: [{ categoryId: { $in: queryObj.category } }],
      });
    }
    if (queryObj.status) {
      this.query = this.query.find({
        status: { $eq: queryObj.status }
      });
    }
    if (queryObj.color) {
      this.query = this.query.find({
        $or: [{
          color: {
            $regex: queryObj.color,
            $options: 'i'
          }
        }],
      });
    }
    if (queryObj.size) {
      this.query = this.query.find({
        size: {
          $regex: queryObj.size,
          $options: 'i'
        }
      });
    }
    if (queryObj.price) {
      // 1: < 20
      // 2: 20< <40
      // 3: 40 < < 60
      // 4: 60 < < 100
      switch (+queryObj.price) {
        case 1: this.query = this.query.find({
          price: { $lt: 20 },
        }); console.log('1'); break;
        case 2: this.query = this.query.find({
          price: { $gt: 20, $lt: 40 },
        }); console.log('2'); break;
        case 3: this.query = this.query.find({
          price: { $gt: 40, $lt: 60 },
        }); console.log('3'); break;
        case 4: this.query = this.query.find({
          price: { $gt: 60, $lt: 100 },
        }); console.log('4'); break;
        case 5: this.query = this.query.find({
          price: { $gt: 100 },
        }); console.log('5'); break;
      }
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
