/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
import store from 'component/mixins/storehlc'
var List = require('component/widgets/listView')
let tmpData = []
class ListApp extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			data: tmpData.length ? tmpData : (this.props.data||[]),
			loading: false,
			over: false,
			trigger: false,
			triggerBar: <div className="overbar"><div className="trigger">加载更多内容</div></div>,
			pulldown: false,
			pulldownBar: <div className="overbar"><div className="pull-bar">刷新页面</div></div>,
			children: true,
			HOC: []  // has hightOrderComponent wrap it
		}
	}

	componentWillMount() {}

	componentDidMount() {
		const lmd = this.props.listMethod
		if (lmd && typeof lmd == 'function') {
			let that = React.findDOMNode(this);
			lmd(that, this.props.store)
		}
	}

	componentWillUpdate(nextProps, nextState) {
		// 更新并将当前数据保存到tmpData，再次进入时，为最后一次数据，但性能并不好
		// 尤其在tabs模块中
		// 暂时注销
		// tmpData = nextState.data
	}

	render(){
		let _props = _.extend({}, this.props)
		delete _props.data

		let loadbar = this.state.loading ? <div className="loadbar"><div className="loader">Loading...</div></div> : []
		let overbar = this.state.over ? <div className="overbar"><div className="over">没有更多内容了</div></div> : []
		let triggerbar = this.state.trigger ? this.state.triggerBar : []
		let pullbar = this.state.pulldown ? this.state.pulldownBar : ''
		delete _props.children
		delete _props.listMethod

		let children = this.state.children
		? ( childs =>  childs ? childs.map( (o, ii) => o ? React.cloneElement(o, {key: ii }):'' ):'' )(this.props.children)
		: ''

		let _cls = 'list-container'
		if(this.props.listClass){
			let l_class = _.trim(this.props.listClass).split(' ')
			l_class.map( (item, ii) => {
				l_class[ii] = _.trim(item)+'-parent'
			})
			_cls = 'list-container ' + l_class.join(' ')
		}

		const listPart = this.state.data&&this.state.data.length
		? <List data={this.state.data} hoc={this.state.HOC} {..._props} />
		: ''
		return (
			<div className={_cls}>
				{pullbar}
				{listPart}
				{loadbar}
				{overbar}
				{triggerbar}
				{children}
			</div>
		)
	}
}

function storeIt(key){
	if (typeof key == 'string') { storeAction(key) }
	return store(key, ListApp)
}

function storeAction(key){
	SAX.set(key, {}, {
		HIDECHILDREN: function(data){
			if (!this||!this.state) return
			if (this.state.children) {
				this.setState({ children: false })
			}
		},
		LOADING: function(data){
			if (!this||!this.state) return
			if (!this.state.over) {
				if (data && data.next && typeof data.next == 'function') data.next()
				if (!this.state.loading) {
					this.setState({ loading: true })
				}
			}
		},
		LOADED: function(data){
			if (!this||!this.state) return
			if (!this.state.over) {
				_.delay(()=>{
					this.setState({
						loading: false,
						pulldown: false,
						trigger: false
					})
				}, 1000)
			}
		},
		UPDATE: function(data){
			if (!this||!this.state) return
			if (!this.state.over) {
				if (data.news) {
					if (_.isPlainObject(data.news)) { data.news = [data.news] }
					if (Array.isArray(data.news)) {
						switch (data.type) {
							case 'append':
								this.setState({ data: [...this.state.data, ...data.news] })
								break;
							case 'prepend':
								this.setState({ data: [...data.news, ...this.state.data] })
								break;
							default:
								this.setState({ data: data.news.length ? data.news : '' })
						}
					}
				}
			}
		},
		OVER: function(data){
			if (!this||!this.state) return
			this.setState({
				loading: false,
				pulldown: false,
				over: true
			})
		},
		EDIT: function(edata){
			if (!this||!this.state) return
			const {index, data} = edata
			let tmpState = this.state.data
			return
			tmpState[index] = data
			this.setState({
				data: tmpState
			})
		},
		TRIGGER: function(data){
			if (!this||!this.state) return
			if (!this.state.over) {
				if (data.bar){
					this.setState({
						triggerBar: data.bar,
						trigger: true,
						loading: false,
						over: false
					})
				} else {
					this.setState({
						trigger: true,
						loading: false,
						over: false
					})
				}
			}
		},
		PULLDOWN: function(data){
			if (!this||!this.state) return
			if (!this.state.over) {
				if (data.bar){
					this.setState({
						pulldownBar: data.bar,
						pulldown: true,
						trigger: false,
						loading: false,
						over: false
					})
				} else {
					this.setState({
						pulldown: true,
						loading: false,
						trigger: false,
						over: false
					})
				}
			}
		}
	})
}

module.exports = storeIt
