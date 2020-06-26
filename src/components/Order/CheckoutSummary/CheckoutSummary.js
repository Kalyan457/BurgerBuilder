import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';

const checkoutSummary = (props) => {
    return(
        <div className={classes.CheckoutSummary}>
            <h1>Your Burger is Delicious !!</h1>
            <div style={{width:'100%', margin:'auto'}}>
                <Burger ingredientsProp = {props.ingredients} />
            </div>
            <Button btnType="Danger" clicked={props.checkoutCancelled}>CANCEL</Button> 
            <Button btnType="Success" clicked={props.checkoutContinued}>CONTINUE</Button>
        </div>
        
    );

}

export default checkoutSummary;