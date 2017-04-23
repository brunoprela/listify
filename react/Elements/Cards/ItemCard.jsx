import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import Items from '../../../models/Items.js'

class ItemCard extends Component {

  constructor(props) {
    super(props);
    this.state = {editMode:false,
                  descriptionMode:false,
                  photoMode:false,
                  newTitle:this.props.item.title,
                  newDescription:this.props.item.description,
                  newPhotoURL: this.props.item.photo,
                  validPhoto:false};
  }

  turnOnEditMode() {
    this.setState({editMode:true});
  }

  turnOffEditMode() {
    this.setState({editMode:false, descriptionMode:false, photoMode:false, validPhoto:false});
  }

  turnOnDescriptionMode() {
    this.setState({descriptionMode:true});
  }

  turnOnPhotoMode() {
    this.setState({photoMode:true});
  }

  savePressed() {
    this.turnOffEditMode();
    var newTitle = this.state.newTitle
    var newDescription = this.state.newDescription;
    var photo = this.state.newPhotoURL;
    var newItem = Items(newTitle,newDescription,photo);
    var index = this.props.index;
    this.props.updateItem(index,newItem);
  }

  onTitleChange(event) {
    this.setState({newTitle:event.target.value});
  }

  onDescriptionChange(event) {
    this.setState({newDescription:event.target.value});
  }

  imageExists(image_url, success, failure){
    var img = new Image();
     img.onload = success;
     img.onerror = failure;
     img.src = image_url;
 }

 photoURLInserted(event) {
   var url = event.target.value;
   var that = this;
   this.imageExists(url, function() {
     //photo found
     that.setState({newPhotoURL:url, validPhoto:true});
   }, function() {
     //photo not found
     that.setState({newPhotoURL:"", validPhoto:false});
   });
 }

  editableItemCard() {
    const { item } = this.props;
    const descriptionPlaceholder = item.description.length > 0 ?  item.description : "Description (Optional)";

    var editIcon = require('../../../public/assets/WhitePencil.svg');
    var photoIcon = require('../../../public/assets/Picture.svg');
    var trashIcon = require('../../../public/assets/TrashCan.svg');

    var iconStyle = {
      width:"15px",
      height:"15px",
      display:"inline-block",
      marginTop:"5px",
      marginLeft:"5px"
    }

    var buttonStyle = {
      display:'flex',
      paddingLeft:"5px",
      width:"85px",
      height:"25px",
      padding:"0px",
      marginBottom:"3px",
      marginLeft: "5px",
      background:"#9B9B9B"

    }

    var buttonTextStyle = {
      display:"inline-block",
      marginLeft:"5px",
      marginTop:"5px"
    }

    var saveButtonStyle = {
      height:"30px",
      width:"80px",
      background:"#66B110",
      marginRight:"5px"
    }

    var cancelButtonStyle = {
      background:"none",
      color:"#9B9B9B"
    }

    return (
      <div className = "EditableItemCard">
        <div className = "ItemContainer">
          {this.state.validPhoto && this.state.photoMode &&
            <img className = "ItemCardImage" src = {this.state.newPhotoURL}/>
          }
          <input className = "TitleInput"
                 type="text"
                 placeholder={item.title}
                 onChange = {this.onTitleChange.bind(this)}
          />

        {(this.state.descriptionMode || item.description.length > 0) &&
          <textarea placeholder={descriptionPlaceholder} onChange = {this.onDescriptionChange.bind(this)}/>
        }
        {!this.state.validPhoto && this.state.photoMode &&
          <input className = "PhotoInput"
                   type="text"
                   placeholder={"URL of Photo"}
                   onChange = {this.photoURLInserted.bind(this)}
            />
        }
        </div>
        <div className = "ButtonContainer">
          <button className = "AddDescriptionButton"
                  onClick={this.turnOnDescriptionMode.bind(this)}
                  style = {buttonStyle}>
            <img src = {editIcon} style = {iconStyle}/>
            <p style = {buttonTextStyle}>Add Info</p>
          </button>

          <button className = "AddPhotoButton"
                  onClick={this.turnOnPhotoMode.bind(this)}
                  style = {buttonStyle}>
            <img src = {photoIcon} style = {iconStyle}/>
            <p style = {buttonTextStyle}>Add Photo</p>
          </button>

          <button className = "DeleteButton"
                  onClick={this.props.deleteItem.bind(null, item)}
                  style = {buttonStyle}>
            <img src = {trashIcon} style = {iconStyle}/>
            <p style = {buttonTextStyle}>Delete</p>
          </button>
        </div>
        <div className = "ExitButtonContainer">
          <button onClick = {this.savePressed.bind(this)}
                  style = {saveButtonStyle}>
                  Save
          </button>
          <button onClick = {this.turnOffEditMode.bind(this)}
                  style = {cancelButtonStyle} >
                  Cancel
          </button>
        </div>
      </div>
    );
  }

  itemCard() {
    const { item, isDragging, connectDragSource, connectDropTarget } = this.props;
		const opacity = isDragging ? 0 : 1;
		const style = {
			opacity: opacity
		};

    const editIcon = require("../../../public/assets/GreyPencil.svg");
    const editIconStyle = {
        width:"15px",
        height:"15px"
      }

		return connectDragSource(connectDropTarget(
        <div className = "ItemCard" style={style}>
          {this.props.canEdit &&
            <button className = "ItemCardEditButton" onClick={this.turnOnEditMode.bind(this)}>
              <img src = {editIcon} style = {editIconStyle}/>
            </button>
          }
          {this.props.showRankingNumber && <p className = "ItemCardRanking">{this.props.index+1 + "."}</p>}
          {item.photo &&
            <img className = "ItemCardImage" src = {item.photo}/>
          }
          <p className = "ItemCardTitle">{item.title}</p>
          <p className = "ItemCardDescription">{item.description}</p>

        </div>
    ));
  }

  render() {
    return this.state.editMode ? this.editableItemCard() : this.itemCard();
  }
}

const CardSource = {
	beginDrag(props) {
		return {
			index: props.index,
			listId: props.listId,
			item: props.item
		};
	},
	endDrag(props, monitor) {
		const itemCard = monitor.getItem();
		const dropResult = monitor.getDropResult();
    if (dropResult) {
      var canDropIntoTarget = dropResult.targetCanDrop === undefined || dropResult.targetCanDrop === true;
      if (canDropIntoTarget && dropResult.listId && dropResult.listId !== itemCard.listId ) {
  			props.removeItem(itemCard.index);
  		}
    }
	}
};

const CardTarget = {
	hover(props, monitor, component) {
		const originalIndex = monitor.getItem().index;
		const hoverIndex = props.index; //index your mouse is hovering over
		const sourceListId = monitor.getItem().listId;
		// Optimization: No need to replace originIndex if we're just hovering over it
		if (originalIndex === hoverIndex) {
			return;
		}
		if (props.listId === sourceListId ) {
			props.moveItem(originalIndex, hoverIndex);
			monitor.getItem().index = hoverIndex;
		}
	}
};

export default flow(
	DropTarget("CARD", CardTarget, (connect, monitor) => ({
		connectDropTarget: connect.dropTarget()
	})),
	DragSource("CARD", CardSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}))
)(ItemCard);
