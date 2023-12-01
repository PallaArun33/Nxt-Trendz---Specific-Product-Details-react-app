// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {brand, imageUrl, title, price, rating} = itemDetails

  return (
    <li className="product-item-card">
      <img
        src={imageUrl}
        alt="similar product"
        className="product-item-image"
      />
      <h1 className="title-head">{title}</h1>
      <p className="brand-para">by {brand}</p>
      <div className="rupee-rating-container">
        <h1 className="rupees-head">Rs {price}/-</h1>
        <button type="button" className="rating-button">
          <p className="rating-count">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </button>
      </div>
    </li>
  )
}
export default SimilarProductItem
