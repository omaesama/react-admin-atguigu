import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './login.less'
import {Button, Form, Icon, Input, message} from 'antd'
// import { reqLogin } from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
// const Item = Form.Item // 不能写在import 之前
// 引入使用 redux
import {connect} from 'react-redux'
import {login} from '../../redux/actions'

// 用户登陆的路由组件
class Login extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

   /*
        对密码进行自定义验证
         用户名/密码的的合法性要求
             1). 必须输入
             2). 必须大于等于4位
             3). 必须小于等于12位
             4). 必须是英文、数字或下划线组成
    */
    validatePwd = (rule, value, callback) => {
        // console.log(value, rule)
        const pwdLen = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        if (!value) {
            callback('必须输入密码')
        } else if (pwdLen < 4) {
            callback('密码必须大于4位')
        } else if (pwdLen > 12) {
            callback('密码必须小于 12 位')
        } else if (!pwdReg.test(value)) {
            callback('密码必须是英文、 数组或下划线组成')
        } else {
            callback() // 必须调用 callback
        }

        // 语法
        // callback() // 验证通过
        // callback('xxxx') // 验证失败, 并指定提示的文本
    }
  

    render() {
        // 如果用户已经登录自动跳转到admin
        // const user = memoryUtils.user
        // 使用redux 去读
        const user = this.props.user
        if(user && user._id) {
            return <Redirect to='/home' />
        }
        // this.props.form 得到具备强大功能的form 对象
        const { getFieldDecorator } = this.props.form

        return ( 
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo"/>
                    <h1>React 项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <div className={user.errorMsg ? 'error-msg show' :
                        'error-msg'}>{user.errorMsg}</div>
                    <h3>用户登陆</h3>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {/*

                                 用户名/密码的的合法性要求
                                     1). 必须输入
                                     2). 必须大于等于4位
                                     3). 必须小于等于12位
                                     4). 必须是英文、数字或下划线组成

                            */}
                          {
                              getFieldDecorator('username', {   // 配置对象: 属性名是特定的一些名称
                                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                                rules: [
                                  { required: true, whitespace: true, message: '用户名必须输入!' },
                                  { min: 4, message: '用户名至少4位' },
                                  { max: 12, message: '用户名最多12位' },
                                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                                  ],
                              })(
                                <Input
                                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                  placeholder="Username"
                                />
                              )
                          }
                        </Form.Item>
                        <Form.Item>
                          {
                              getFieldDecorator('password', {
                                rules: [
                                      { required: true, message: 'Please input your Password!' },
                                      // 使用自定义的验证规则
                                      { validator: this.validatePwd }
                                  ],
                              })(
                                <Input
                                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                  type="password"
                                  placeholder="Password"
                                />,
                              )
                          }

                            {/*<Input*/}
                                {/*prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
                                {/*type="password"*/}
                                {/*placeholder="Password"*/}
                                {/*/>*/}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
         )
    }

    handleSubmit(e) {
        // 阻止事件默认行为(不提交表单)
        e.preventDefault()
        // const form = this.props.form
        // const values = form.getFieldsValue()
        // console.log(values)

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                const {username, password} = values

                // 调用分发异步action的函数 => 发登陆的异步请求, 有了结果后更新状态
                this.props.login(username, password)

                // 初始用法
                // reqLogin(username, password).then(response => {
                //     console.log(response);
                // })

                // async和await
                // try {
                //     const result = await reqLogin(username, password)
                //     console.log('请求成功', result)
                // } catch (e) {
                //     console.log(e)
                // }   error 已经在封装 axios 是处理掉了

                // const result = await reqLogin(username, password)
                // console.log('请求成功', result)


                // if(result.status === 0) { // 登陆成功
                //     message.success('登录成功')
                //
                //     const user = result.data
                //     storageUtils.saveUser(user)
                //     memoryUtils.user = user
                //     // 跳转到 admin
                //     // 细节： 使用replace表示当我们登陆成功以后是不需要再回到login页面的 故不用push
                //     this.props.history.replace('/home')
                // } else {
                //     message.error(result.msg)
                // }
            } else {
                message.error('校验失败')
            }
        });
    }
}

/*
  async和await
    1. 作用?
       简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
       以同步编码(没有回调函数了)方式实现异步流程
    2. 哪里写await?
        在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
    3. 哪里写async?
        await所在函数(最近的)定义的左侧写async
*/

/*
* 高阶函数
*       1). 一类特别的函数
*           a. 接受函数类型的参数
*           b. 返回值是函数
*       2). 常见举例：
*           a. 定时器: setTimeout()/setInterval()
*           b. Promise: Promise(() => {}) then(value => {}, reason => {})
*           c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
*           d. 函数对象的bind()
*           e. Form.create()() / getFieldDecorator()()
*
* 高阶组件
*       1). 本质就是一个函数
*       2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
*       3). 作用: 扩展组件的功能
*       4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
*
*
*   Form.create() 包装Form组件生成一个新的组件Form(Login) 可以通过react dev tools 查看
*   新组件会向Form组件传递一个强大的对象属性 form
* */
// export default Login
const WrappedLoginForm = Form.create({ name: 'normal_login' })(Login)
export default connect(
    state => ({user: state.user}),
    {login}
)(WrappedLoginForm)

/*
    前台表单验证，
    收集表单数据

    用户名/密码的合法性要求：
        用户名/密码的的合法性要求
        1). 必须输入
        2). 必须大于等于 4 位
        3). 必须小于等于 12 位
        4). 必须是英文、 数字或下划线组成
 */