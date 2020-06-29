  
import {
    cartItems
} from '../helpers/dbConnect.ts';


export const addCartItems = async(context: any) => {
    let responseBody = {};
    try{
        let body: any = await context.request.body();
        await cartItems.insertOne(body.value);
        const data :any = await cartItems.find({});
        responseBody = {
            data
        };
    } catch(e) {
        responseBody = {
            error: {
                code: e.code,
                message: e.message
            }
        };
    }
    context.response.body = responseBody;
    context.response.status = 200;
};

export const getCartItems = async(context: any)=> {
    let responseBody = {};
    try{
        const data :any = await cartItems.find({});
        responseBody = {
            data
        };
    } catch(e) {
        responseBody = {
            error: {
                code: e.code,
                message: e.message
            }
        };
    }
    context.response.body = responseBody;
    context.response.status = 200;
};

export const deleteCartItems = async(context: any) => {
    let responseBody = {};
    try{
        let id :string = context.params.id;
        const result = await cartItems.deleteOne({_id: {"$oid": id}});
        const data :any = await cartItems.find({});
        responseBody = {
            data
        };
    } catch(e) {
        responseBody = {
            error: {
                code: e.code,
                message: e.message
            }
        };
    }
    context.response.body = responseBody;
    context.response.status = 200;
};

export const updateCartItems = async(context: any) => {
    let responseBody = {};
    try{
        const id :string = context.params.id;
        let  body :any = await context.request.body()
        const result = await cartItems.updateOne({_id: {"$oid": id}}, {$set: body.value});
        const data :any = await cartItems.find({});
        responseBody = {
            data
        };
    } catch(e) {
        responseBody = {
            error: {
                code: e.code,
                message: e.message
            }
        };
    }
    context.response.body = responseBody;
    context.response.status = 200;
}