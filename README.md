## 动态表单

用于读取表单定义，然后渲染组件


## 安装

* `npm install  dynamicform-react-client --save`;


## 用法

* 创建 store.js
```bash
 import { applyMiddleware, createStore, combineReducers} from 'redux';
    import thunk from 'redux-thunk';
    import { reducer as formReducer } from 'dynamicform-react-client';

    const middleware = applyMiddleware(thunk);

    export default createStore(
        combineReducers({
            formReducer,
        }),
        middleware
    );
```

* 创建 index.js
```bash
import {Provider} from 'react-redux';
import store from '../../../store';
import DynamicForm from 'dynamicform-react-client'

beforeSubmit(){
        console.log('回调函数beforeSubmit');
    }
    onSuccess(){
        console.log('回调函数onSuccess');
    }
    onError(){
        console.log('回调函数onError')
    }
    onSubmit(){
        console.log('自定义onSubmit')
    }


<Provider store={store}>
            <DynamicForm
                formDefinitionSrc=''
                submitDataSrc={``}
                _id={''}
                beforeSubmit={this.beforeSubmit}
                onSuccess={this.onSuccess}
                onError={this.onError}
            >
            </DynamicForm>
        </Provider>)
```

## Changelog
See [CHANGELOG.md](https://github.com/dynamicform/dynamicform-react-client/blob/master/CHANGELOG.MD)

