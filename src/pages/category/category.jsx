import React, { Component } from 'react'
import { Card, Table, Button, Icon, message} from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys } from '../../api'

class Category extends Component {

    state = {
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID
        parentName: '', // 父分类的名称
        loading: false
    }

    // 获取分类列表

    // 异步获取一级/二级分类列表显示
    // parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
    getCategorys = async(parentId) => {
        // 在发请求前, 显示loading
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        console.log(result)
        if(result.status === 0) {
            // 取出分类数组(可能是一级也可能二级的)
            const list = result.data
            if(parentId === '0') { // 更新一级分类别
                this.setState({
                    categorys: list
                })
            } else { // 更新二级分类
                this.setState({
                    subCategorys: list
                })
            }

        } else {
            message.error('获取分类数据失败')
        }
    }

    // 初始化初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name' // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                align: 'center',
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        { this.state.parentId === '0' ? <LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ]
    }

    // 为第一次render()准备数据
    componentWillMount() {
        this.initColumns()
    }

    // 执行异步任务: 发异步ajax请求
    componentDidMount () {
        // 获取一级分类列表显示
        this.getCategorys()
    }

    render() {
        const { categorys, loading, subCategorys, parentId, parentName } = this.state

        // card 左侧标题
        const title = parentId === '0' ? '一级分类标题' :
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        // card 右侧
        const extra = (
            <Button type="primary">
                <Icon type="plus"/>
                增加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                />
            </Card>
         );
    }

    // 显示一级分类列表
    showCategorys = () => {
        // 更新state 显示为一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
        //  注意：这里不用再次去请求一级列表的接口的
    }

    // 显示指定一级分类对象的二子列表
    showSubCategorys = (category) => {
        console.log(category);
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            // console.log('parentId', this.state.parentId)
            // 获取二级分类列表显示
            this.getCategorys()

            // setState()不能立即获取最新的状态: 因为setState()是异步更新状态的
        })
    }
}
 
export default Category