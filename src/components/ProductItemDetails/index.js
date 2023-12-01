// Write your code here

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {count: 1, apiStatus: apiStatusConstants.initial, productItemList: []}

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const ProductItemApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(ProductItemApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProductItemData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        price: data.price,
        description: data.description,
        similarProducts: data.similar_products.map(item => ({
          id: item.id,
          imageUrl: item.image_url,
          title: item.title,
          style: item.style,
          price: item.price,
          description: item.description,
          brand: item.brand,
          totalReviews: item.total_reviews,
          rating: item.rating,
          availability: item.availability,
        })),
      }
      console.log(updatedProductItemData)
      this.setState({
        productItemList: updatedProductItemData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickMinusBtn = () => {
    const {count} = this.state
    if (count <= 1) {
      return this.setState({count: 1})
    }
    return this.setState(prevState => ({
      count: prevState.count - 1,
    }))
  }

  onClickPlusBtn = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderProductItemDetailsView = () => {
    const {productItemList, count} = this.state
    const {
      availability,
      brand,
      imageUrl,
      rating,
      title,
      price,
      description,
      totalReviews,
      similarProducts,
    } = productItemList
    return (
      <div className="product-success-container">
        <div className="top-product-container">
          <img src={imageUrl} alt="product" className="product-item-img" />
          <div className="product-info-container">
            <h1 className="item-heading">{title}</h1>
            <p className="price">RS {price}</p>
            <div className="rating-container">
              <button type="button" className="rating-btn">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </button>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available-para">
              <span className="available">Available:</span> {availability}
            </p>
            <p className="brand-para">
              <span className="brand">Brand: </span>
              {brand}
            </p>
            <hr className="hr-line" />
            <div className="plus-minus-container">
              <button
                type="button"
                className="minus-btn"
                aria-label="Save"
                data-testid="minus"
                onClick={this.onClickMinusBtn}
              >
                <BsDashSquare className="minus-icon" />
              </button>

              <p className="count-para">{count}</p>
              <button
                type="button"
                className="plus-btn"
                aria-label="Save"
                data-testid="plus"
                onClick={this.onClickPlusBtn}
              >
                <BsPlusSquare className="plus-icon" />
              </button>
            </div>
            <button type="button" className="add-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="bottom-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="ul-product-item">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                itemDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickContinueShoppingBtn = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-btn"
        onClick={this.onClickContinueShoppingBtn}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductItemCard = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderProductFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductItemCard()}
      </>
    )
  }
}

export default ProductItemDetails
