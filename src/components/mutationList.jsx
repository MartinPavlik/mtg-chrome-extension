import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap'

export default class MutationList extends Component {
  constructor(props) {
    super(props)
    this.renderMutation = this.renderMutation.bind(this)
  }

  getBsStyle(name) {
    if(name.indexOf('foil') != -1)
      return 'success';
    if(name.indexOf('lightly played') != -1 || name.indexOf('moderately played') != -1)
      return 'warning';
    if(name.indexOf('heavily played') != -1)
      return 'danger'; 
    return 'default;'
  }

  renderMutation(item) {
    return (
      <tr className='mutation' key={item.id}>
        <td>
          <OverlayTrigger
            placement='right'
            overlay={
              <Popover>
                <img
                  src={ item.imgUrl }
                  width= { 300 }
                />
              </Popover>
            } 
          >
            <Button
              bsStyle={ this.getBsStyle(item.name) }
              onClick={ (e) => {
                // todo
                e.preventDefault()
                this.props.handleAddToCart(item, this.props.card)
              }}
            >
              { item.name }
            </Button>
          </OverlayTrigger>
          {item.orderedCount >= item.count && 
            <span className='alert alert-danger' style={ {marginLeft: '10px'} }>
              {'No more cards available'}
            </span>
          }
        </td>
        <td>
          { item.orderedCount != 0 && 
            <span>
              <span className='alert alert-warning'>
                { ` ${item.orderedCount} x  ${item.price} = ${item.orderedCount*item.price} ,-` }
              </span>
              <Button bsStyle='danger' bsSize='sm' onClick={ (e) => {
                // todo
                e.preventDefault()
                this.props.handleRemoveFromCart(item, this.props.card)
              }}>
                {'-1'}
              </Button>
            </span>
          }
        </td>
        <td>
          {item.edition}
        </td>
        <td>
          {item.rarity}
        </td>
        <td>
          {item.count} x
        </td>
        <td>
          {item.price} ,-
        </td>
      </tr>
    )
  }

  render() {
    const { items } = this.props;
    return (
      <table className='mutations'>
        <tbody>
          { items.map(this.renderMutation) }
        </tbody>
      </table>
    )
  }
}

MutationList.propTypes = {
  card: PropTypes.object.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
}
