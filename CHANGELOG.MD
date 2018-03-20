# Changelog

### 1.1.2 (2017-07-05) KangYe
    1. 修改DynamicControl默认数组格式，字段：defaultCount
    2. 删除DynamicFormRender中注释
### 1.1.3 (2017-07-05) KangYe
    1.修改uuid的取值方式lodash
    2.删除相关console.log代码
### 1.3.1 (2017-07-19) KangYe
    1.修改 组件中shouldComponentUpdate 中级联的 isCascadElement中获
    2.添加Button中保存、和自定义function功能
    3.修改Viewable true是显示的bug
    4.添加button禁用和隐藏功能
    5.删除Button中handOnClick违逆框架做法的代码
    6.修改getViewable、getDisabled的逻辑处理
    7.能处理默认的Viewable和disabled和组件和组件的联动并列出现问题的修复
    8.修改getViewable、getDisabled中cascadElement单词错误
    9.修改common.js属性名称错误问题
    10.删除conditionMap的子集item
    11.修复ValidationButton中FormItemLayout没有导入
    12.添加common中getIsCascadeElement的单元测试
    13.修改所有组件中的getViewable为getHidden
    14.修改所有组件中getHidden、getDisabled的逻辑代码优化
    15.针对修改的配置json同时修改common，getIsCascadeElement方法的逻辑代码优化
### 1.3.2 (2017-07-21) KangYe
    1.修复ValidationButton组件bug
### 1.3.3 (2017-07-21) KangYe
    1.修复组件中@connect语法为 export default connect(MapStateToProps)(Button)
    2.修复submit提交事件bug
### 1.4.0 (2017-07-25) KangYe
    1.修改Form提交事件的方式，由表单触发，改为按钮触发
    2.修复reset按钮事件bug
    3.优化button中自定义传入function用到eval函数改为new Function方式
    4.按钮的类型增加5种，分别为：save(保存)、submit(提交)、custom(自定义function)、validationButton(验证按钮,1.4.0暂不支持)、reset(重置)
### 1.4.1 (2017-07-26) KangYe
    1.修改Button onSuccess等方法获取不到bug，暂用传值方式传递到button中，后续修复
### 1.5.0 (2017-08-03) KangYe
    1.重构上传(图片、文件)组件
    2.Form增加onFormLoadBefore事件，用于处理回填数据格式(formData)function，该方法必须return
### 1.5.1 (2017-08-03) KangYe
     1.删除{onFormLoadBefore} 自定义方法
     2.修改加载数据为dataPath传入方式
### 1.5.2 (2017-08-03) KangYe
     1.修复DynamicControl组件中，数据回填渲染不出来BUG
### 1.5.3 (2017-08-03) KangYe
    1.修复上传图片组件中thumbUrl中修改为空，默认存储为base64位图片
    2.修复UpdateDynamicFormPage 单词错误问题
    3.修复server返回数据统一包装到response.data中
    4.修复数据回填时reaponse.data取数据
### 1.5.4 (2017-08-07) KangYe
    1.修改DynamicControl 标题名称可以定义
    2.添加Button、CascadeSelect对propsType检测
### 1.5.5 (2017-08-08) KangYe
    1.测试Jenkins发送邮件
### 1.6.0 (2017-08-08) KangYe
    1.加入propType对组件的初始化的检测
        Button、CascadeSelect、CheckBoxGroup、DatePicker、DynamicControl、InputNumber、MonthPicker、RadioGroup、RangePicker、Select、Textfield、TimePicker、Upload、ValidationButton
### 1.6.1 (2017-08-11) KangYe
    1.getHidden() 和 getDisable()、getRule()重命名为 get isHidden() get isDisable()、get Rule()
    2.修复lint语法问题
### 1.6.2 (2017-08-22) KangYe
    1.修复propTypes
### .