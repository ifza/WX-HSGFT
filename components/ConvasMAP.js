var util = require('../utils/md5.js')

//画布地图1
class ConvasMap {

    //默认参数设置
    _default() {
        return {
            debug: false,
            width: 320, //canvas width
            height: 320, //canvas height
            convasID: 'map', //画布索引ID
            map: {}, //地图背景数据      
            masks: [], //地图覆盖物
            zoom: 1, //默认缩放比例            
            ctx: {}, //画布对象
            CurState: '', //当前事件类型
            offset: { x: 0, y: 0 }, //坐标偏移值
            TempPoint: { x: 0, y: 0 }, //临时坐标偏移值
            InitPoint: { x: 0, y: 0, state: false }, //初始点击坐标值
            maxZoom: 2.5, //最大缩放比例
            minZoom: 0, //最小缩放比例
            StartDiameter: 0, //缩放初始直径
            deviation: { x: 0, y: 0 }, //拖拽可移动的偏离范围
            click: {}, //计数器事件
            callback: function() { console.log('未设置回调事件') }, //点击回调事件
        }
    }

    //构造函数,初始化参数数据
    constructor(opts = {}) {
        if (this.debug) console.log('%c DEBUG INFO constructor:构造函数', 'color:red')

        Object.assign(this, this._default(), opts)
        this.ctx = wx.createCanvasContext(this.convasID)
    }

    //初始化
    Init() {
        if (this.debug) console.log('%c DEBUG INFO Init:初始化:promise', 'color:red')
            //计算初始缩放比例
        return this._load_stuff()
            .then(this._calc_init_zoom())
            .then(this.__repaint())
    }

    //加载事件
    Load() {
        if (this.debug) console.log('%c DEBUG INFO Load:加载事件:promise', 'color:red')
        this.click = undefined
        return this._load_stuff()
            .then(this._calc_init_zoom())
            .then(this.__repaint())
    }

    State(e) {
        if (this.debug) console.log('%c DEBUG INFO state', 'color:red')
            //设定'click'事件定时器,延时0.4秒执行
        this.click = setTimeout(() => { this._click(e) }, 400)
    }

    End(e) {
        if (this.debug) console.log('%c DEBUG INFO end', 'color:red')
        switch (this.CurState) {
            case 'click':
                if (this.debug) console.log('%c DEBUG INFO end-click', 'color:red')
                break;
            case 'zoom':

                if (this.debug) console.log('%c DEBUG INFO end-zoom', 'color:red')
                break;
            case 'drag':
                if (this.debug) console.log('%c DEBUG INFO end-drag', 'color:red')
                break;
        }
        //重置数据
        this.StartDiameter = 0
        this.CurState = ''
        this.InitPoint.state = false
    }

    Move(e) {
        if (this.debug) console.log('%c DEBUG INFO move', 'color:red')
            //移除'click'事件定时器
        if (this.click !== undefined) {
            clearTimeout(this.click)
        }
        //监测触点数量,并根数触点数量执行不同函数
        switch (e.touches.length) {
            case 1: //执行拖拽事件        
                this.CurState = 'drag'
                this._drag(e.touches[0]);
                break;
            case 2: //执行缩放事件
                this.CurState = 'zoom'
                this._zoom(e.touches[0], e.touches[1]);
                break;
            case 3: //3点移动执行重置
                this.Load()
                break;
        }
    }

    //点击事件
    _click(e) {
        if (this.debug) {
            console.log('%c DEBUG INFO click:点击事件', 'color:red')
        }
        // let zoom = this.zoom
        let x = e.touches[0].x
        let y = e.touches[0].y
            //遍历检测坐标点是否存在覆盖物
        for (let r of this.masks) {
            let coor = this._calc_masks_coordinate(r) //获取计算后的覆盖物坐标位置
            if (r.icon && r.icon.show) {
                let left = coor.x - r.icon.w / 2
                let right = left + r.icon.w
                let top = coor.y - r.icon.h
                let bottom = coor.y
                    //debug info
                if (this.debug) {
                    console.log(left, top, right, bottom)
                    this.ctx.setStrokeStyle('red')
                    this.ctx.strokeRect(left, top, r.icon.w, r.icon.h)
                    this.ctx.draw(true)
                }
                if (x > left && x < right && y > top && y < bottom) {
                    if (r.link) {
                        wx.navigateTo({ url: r.link })
                    }
                    if (typeof this.callback === 'function') {
                        if (this.debug) {
                            console.log('click icon ' + r.data.name)
                        }
                        this.callback(r.data)
                    } else {
                        console.log('click event callback type error')
                    }
                    break
                }

            }
            if (r.title && r.title.show) {

                let left = 0,
                    right = 0,
                    top = 0,
                    bottom = 0

                if (r.icon && r.icon.show) {
                    switch (r.title.align) {
                        case 'top':
                            left = coor.x - ((r.title.text.length * r.title.size) / 2)
                            right = left + (r.title.text.length * r.title.size)
                            top = coor.y - r.icon.h - r.title.size
                            bottom = top + r.icon.h
                            break;
                        case 'bottom':
                            left = coor.x - ((r.title.text.length * r.title.size) / 2)
                            right = left + (r.title.text.length * r.title.size)
                            top = coor.y
                            bottom = top + r.title.size
                            break;
                        case 'left':
                            top = coor.y - r.icon.h + (r.title.size / 2)
                            bottom = top + r.title.size
                            left = coor.x - (r.icon.w / 2) - (r.title.text.length * r.title.size)
                            right = left + (r.title.text.length * r.title.size)
                            break;
                        case 'right':
                            top = coor.y - r.icon.h + (r.title.size / 2)
                            bottom = top + r.title.size

                            left = coor.x + (r.icon.w / 2)
                            right = left + (r.title.text.length * r.title.size)
                            break;
                    }
                } else {
                    left = coor.x - ((r.title.text.length * r.title.size) / 2)
                    right = left + (r.title.text.length * r.title.size)
                    top = coor.y - (r.title.size / 2)
                    bottom = top + r.title.size
                }

                if (this.debug) {
                    console.log(left, top, right, bottom)
                    this.ctx.setStrokeStyle('green')
                    this.ctx.strokeRect(left, top, (r.title.text.length * r.title.size), r.title.size + 4)
                    this.ctx.draw(true)
                }
                if (x > left && x < right && y > top && y < bottom) {
                    if (r.link) {
                        wx.navigateTo({ url: r.link })
                    }
                    if (typeof this.callback === 'function') {
                        if (this.debug) {
                            console.log('click title ' + r.data.name)
                        }
                        this.callback(r)
                    } else {
                        console.log('click event callback type error')
                    }
                    break
                }
            }
        }
    }

    //缩放事件
    _zoom(t1, t2) {
        if (this.debug) console.log('%c DEBUG INFO zoom:缩放事件', 'color:red')
            //计算坐标点之间的直径距离
        let x = Math.abs(t1.x - t2.x)
        let y = Math.abs(t1.y - t2.y)
        let CurrentDiameter = Math.sqrt((x * x) + (y * y))
            //检测是否保存了初次坐标点直径距离
        if (this.StartDiameter == 0) {
            //设置初始缩放直径
            this.StartDiameter = CurrentDiameter
        } else {

            //计算夹捏后与第一次直径的距离
            let dist = this.StartDiameter - CurrentDiameter
            let curZoom = dist > 0 ? this.zoom - 0.05 : this.zoom + 0.05

            //检测缩放最大值最小值检测
            if (curZoom > this.minZoom && curZoom < this.maxZoom) {
                //检测缩放后是否已超出指定范围
                if (this.map.w * curZoom > this.width & this.map.h * curZoom > this.height) {
                    this.zoom = curZoom
                } else {
                    this.zoom = curZoom = this.minZoom
                }
            } else {
                this.zoom = curZoom = dist > 0 ? this.minZoom : this.maxZoom
            }
            //检测缩放偏移坐标是否超出最大范围
            this._calc_deviation()
            if (this.offset.x < this.deviation.x) {
                let ax = (this.offset.x + ((this.map.w * this.zoom) - (this.map.w * curZoom)))
                this.offset.x = ax > 0 ? ax : ax / 2
            }
            if (this.offset.y < this.deviation.y) {
                let ay = (this.offset.y + ((this.map.h * this.zoom) - (this.map.h * curZoom)))
                this.offset.y = ay > 0 ? ay : ay / 2
            }
            this.__repaint()
        }
    }

    //拖拽事件
    _drag(t) {
        if (this.debug) console.log('%c DEBUG INFO drag:拖拽事件', 'color:red')
        if (!this.InitPoint.state) {
            this._calc_deviation() //计算最大可移动范围
                //保存偏移坐标到临时坐标
            this.TempPoint.x = this.offset.x
            this.TempPoint.y = this.offset.y
                //设置初始点击坐标
            this.InitPoint.x = t.x
            this.InitPoint.y = t.y
                //设置初始点数据获取标识
            this.InitPoint.state = true
        }

        //计算当前移动范围
        let moveX = (t.x - this.InitPoint.x) + this.TempPoint.x
        let moveY = t.y - this.InitPoint.y + this.TempPoint.y

        //检测移动范围是否超出
        if ((moveX > this.deviation.x) & (moveX < 0)) {
            this.offset.x = moveX
        } else {
            if (t.x != this.InitPoint.x) {
                if (t.x > this.InitPoint.x) {
                    this.offset.x = 0
                }
                if (t.x < this.InitPoint.x) {
                    this.offset.x = this.deviation.x
                }
            }
        }
        if ((moveY > this.deviation.y) & (moveY < 0)) { this.offset.y = moveY } else {
            if (t.y != this.InitPoint.y) {
                if (t.y > this.InitPoint.y) {
                    this.offset.y = 0
                }
                if (t.y < this.InitPoint.y) {
                    this.offset.y = this.deviation.y
                }
            }
        }
        this.__repaint()
    }

    //地图绘制
    __repaint() {
        if (this.debug) console.log('%c DEBUG INFO _repaint:地图绘制', 'color:red')
            //绘制地图背景图片
        return this._repaint_background()
            .then(this._repaint_masks())
            .then(this.ctx.draw())
    }

    //绘制地图背景图片
    _repaint_background() {
        return new Promise((res, rej) => {
            this.ctx.drawImage(this.map.local, this.offset.x, this.offset.y, this.map.w * this.zoom, this.map.h * this.zoom)
            res()
        })
    }

    //绘制覆盖物
    _repaint_masks() {
            return new Promise((res, rej) => {
                if (this.masks) {
                    this.masks.forEach(r => {
                        let coor = this._calc_masks_coordinate(r) //获取计算后的覆盖物坐标位置
                        if (r.icon && r.icon.show) {
                            this._repaint_masks_icon(r, coor)
                        }
                        if (r.title && r.title.show) {
                            this._repaint_masks_title(r, coor)
                        }
                    })
                    res()
                } else {
                    rej('未设置覆盖物')
                }
            })
        }
        //绘制遮罩物标题
    _repaint_masks_title(v, coor) {
            if (this.debug) console.log('%c DEBUG INFO repaint_masks_title:绘制遮罩物标题', 'color:red')
            this.ctx.setTextAlign('center')
            this.ctx.setTextBaseline('middle')
            this.ctx.setFillStyle(v.title.color) //字体颜色
            this.ctx.setFontSize(v.title.size) //字体大小  
            let fontX, fontY = 0
            if (v.icon && v.icon.show) {
                switch (v.title.align) {
                    case 'top':
                    case 'bottom':
                        fontX = coor.x
                        if (v.title.align == 'top') {
                            fontY = coor.y - v.icon.h - v.title.size / 2
                        } else {
                            fontY = coor.y + v.title.size / 2;
                        }
                        break;
                    case 'left':
                    case 'right':
                        fontY = coor.y - v.icon.h / 2
                        if (v.title.align == 'left') {
                            fontX = coor.x - (v.icon.w / 2) - ((v.title.text.length * v.title.size) / 2)
                        } else {
                            fontX = coor.x + ((v.icon.w / 2) + ((v.title.text.length * v.title.size) / 2))
                        }
                        break;
                }
            } else {
                fontX = coor.x
                fontY = coor.y
            }
            //this.ctx.setStrokeStyle('red')
            //this.ctx.strokeRect(fontX, fontY, v.icon.w,v.icon.h)

            this.ctx.fillText(v.title.text, fontX, fontY)

        }
        //绘制遮罩物图标
    _repaint_masks_icon(v, coor) {
        if (this.debug) console.log('%c DEBUG INFO repaint_masks_icon:绘制遮罩物图标', 'color:red')
        this.ctx.drawImage(v.icon.src, (coor.x - (v.icon.w / 2)), (coor.y - v.icon.h), v.icon.w, v.icon.h) //绘制覆盖物

    }
    _repaint_masks_img() {}

    //计算初始缩放比例
    _calc_init_zoom() {
        if (this.debug) console.log('%c DEBUG INFO calc_init_zoom:计算初始缩放比例:promise', 'color:red')
        return new Promise((res, rej) => {
            if (this.map.w == this.map.h) {
                if (this.width > this.height) {
                    this.minZoom = this.zoom = this.width / this.map.w
                } else {
                    this.minZoom = this.zoom = this.height / this.map.h
                }
            } else {
                if (this.map.w > this.map.h) {
                    this.minZoom = this.zoom = this.height / this.map.h
                } else {
                    this.minZoom = this.zoom = this.width / this.map.w
                }
            }
            //设置初始化中心显示
            this.offset.x = -(((this.map.w * this.zoom) - this.width) / 2)
            this.offset.y = -(((this.map.h * this.zoom) - this.height) / 2)
            res()
        })
    }

    //计算当前可移动最大范围
    _calc_deviation() {
        if (this.debug) console.log('%c DEBUG INFO calc_deviation:计算当前可移动最大范围', 'color:red')
        this.deviation.x = -((this.map.w * this.zoom) - this.width)
        this.deviation.y = -((this.map.h * this.zoom) - this.height)
    }

    //根据偏移值和缩放值计算覆盖物最新坐标值
    _calc_masks_coordinate(o) {
        if (this.debug) console.log('%c DEBUG INFO calc_masks_coordinate:根据偏移值和缩放值计算覆盖物最新坐标值', 'color:red')
            // if (o.icon && o.icon.show) {
            //   return {
            //     x: this.offset.x + ((o.x * this.zoom) - (o.w / 2)),
            //     y: this.offset.y + ((o.y * this.zoom) - o.h)
            //   }
            // } else {
        return {
            x: this.offset.x + (o.x * this.zoom),
            y: this.offset.y + (o.y * this.zoom)
        }
        //}

    }

    //TODO:加载资源并保存到本地存储
    _load_stuff() {
        if (this.debug) console.log('%c DEBUG INFO load_stuff:加载资源并保存到本地存储:promise', 'color:red')
        let self = this
        let key = util.md5(self.map.remote) //根据地址生成MD5串,并当本地存储KEY值
        let sto = wx.getStorageSync(key) //根据KEY拉取本地存储数据

        return new Promise((res, rej) => {
            //检测本地存储数据是否存在    
            if (sto) {
                console.log(1)
                self.map.local = sto.path
                self.map.w = sto.width
                self.map.h = sto.height
                res()
            } else {
                console.log(2)
                    //获取本地资源,并将资源数据放入存储中
                wx.getImageInfo({
                    src: self.map.remote,
                    success: function(r) {

                        wx.setStorageSync(key, r) //将数据保存到本地存储
                        console.log(self.map.remote, r.path)
                        self.map.local = r.path
                        self.map.w = r.width
                        self.map.h = r.height
                        res()
                    }
                })
            }
        })
    }

}
export default ConvasMap