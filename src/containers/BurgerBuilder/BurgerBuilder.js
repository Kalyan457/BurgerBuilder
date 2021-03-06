import React, { useState,useEffect } from 'react';
import Auxillary from '../../hoc/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Modal from '../../components/UI/Modal/Modal'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';


const burgerBuilder = props =>{
    const [purchasing,setPurchasing] = useState(false);
 
    useEffect(()=>{
        props.onInitIngredients();
    },[]); 

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
                    .map(igKey =>{
                        return ingredients[igKey];
                    })
                    .reduce((sum,el) =>{
                        return sum+el;
                    },0);
        return sum>0 ;
    }

    const purchaseHandler = () =>{
        if(props.isAuthenticated){
            setPurchasing(true);
        }
        else{
            props.onSetAuthRedirectPath('/checkout');
            props.history.push("/auth");
        }
    }

    const purchaseCancelHandler = () =>{
        setPurchasing(false);
    }

    const purchaseContinueHandler = () =>{
        props.onInitPurchase();
        props.history.push('/checkout');
    } 

    const disabledInfo = {
        ...props.ings
    };

    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key]<=0;
    }
    let orderSummary=null;
    let burger = props.error ? <p>There is a Problem with the Application</p> : <Spinner />;
    if(props.ings){
        burger = (
            <Auxillary>
                <Burger ingredientsProp={props.ings}/>
                    <BuildControls
                        ingredientAdded={props.onIngredientAdded}
                        ingredientRemoved={props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={props.price}
                        purchasable={updatePurchaseState(props.ings)}
                        isAuth={props.isAuthenticated}
                        ordered={purchaseHandler}/>
            </Auxillary>            
        );
        orderSummary=<OrderSummary ingredients={props.ings} 
                        purchaseCancelled={purchaseCancelHandler}
                        purchaseContinued={purchaseContinueHandler}
                        price={props.price} />;
    }
    return(  
        <Auxillary>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Auxillary>
    )

}

const mapStateToProps = state => {
    return{
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        error:state.burgerBuilder.error,
        isAuthenticated:state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded : (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved : (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(burgerBuilder,axios));