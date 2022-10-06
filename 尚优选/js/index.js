window.onload = function() {
    //记录点击缩略图下标的字段
    var bigImgIndex = 0;

    //路径导航的数据渲染
    navPathDataBind();

    function navPathDataBind() {
        /*
         *先获取路径导航的页面元素
         * 再来获取所需要的数据
         * 由于数据是需要动态产生的,那么相应的DOM元素也应该是动态产生的--->
         * 需要创建DOM元素,根据数据的数量来进行创建DOM元素
         * 在遍历数据创建DOM元素的最后一条, 只创建a标签, 不创建i标签
         */

        //1.获取导航的元素对象
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');

        //2.获取数据
        var path = goodData.path;

        //3.遍历数据
        for (var i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                var aNode = document.createElement("a");
                aNode.textContent = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //4.根据数据的数量创建相应数量的a标签与i标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.textContent = path[i].title;

                //创建i标签
                var iNode = document.createElement('i');
                iNode.textContent = '/';

                //让navPath追加a与i标签
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }

        }
    }

    //放大镜的移入移出效果
    bigClassBind()

    function bigClassBind() {
        /*
         * 思路:
         * 1.鼠标移入小图框时获取小图框元素对象(onmouseenter)
         * 2.鼠标获取小图框元素对象时产生了蒙版和大图框
         * 3.移出鼠标时移除蒙版和大图框(onmouseleave)
         * */
        //  1.鼠标移入小图框时获取小图框元素对象(onmouseenter)
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');
        //设置移入的事件
        smallPic.onmouseenter = function() {
            //获取数据
            var imgsrc = goodData.imagessrc;

            //2.创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.id = "mask";
            //创建大图框元素
            var bigPic = document.createElement('div');
            bigPic.id = 'bigPic';
            //创建大图片元素
            var bigImg = document.createElement('img');
            bigImg.src = imgsrc[bigImgIndex].b;

            //大图框追加大图片
            bigPic.appendChild(bigImg);
            //让小图框追加蒙版
            smallPic.appendChild(maskDiv)
                //leftTop追加大图框
            leftTop.appendChild(bigPic);

            //设置移动事件
            smallPic.onmousemove = function(event) {
                //event.clientX是鼠标距离浏览器左侧X轴的值
                //getBoundingClientRect().left: 小图框元素距离浏览器左侧可视left的值
                //offsetWidth:为元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }
                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }


                //设置蒙版元素的left和top值
                maskDiv.style.left = left + 'px';
                maskDiv.style.top = top + 'px';
                //移动的比例关系=蒙版元素移动的距离/大图片移动的距离
                //蒙版元素移动的距离=小图框的宽度-蒙版元素的宽度
                //大图片元素移动的距离=大图片宽度-大图框宽度
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth)
                    // console.log(scale)---scale=0.495
                bigImg.style.left = -left / scale + 'px';
                bigImg.style.top = -top / scale + 'px';
            }

            //设置移出鼠标效果
            smallPic.onmouseleave = function() {

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);
                //让leftTop的元素移除大图框
                leftTop.removeChild(bigPic);
            }
        }
    }
    //    动态渲染放大镜缩略图的数据
    thumbnailData()

    function thumbnailData() {
        /*
         * 1.先找到picList下的ul元素
         * 2.获取data.js下的图片元素
         * 3.遍历数组, 根据数组的长度创建li元素
         * */
        var ul = document.querySelector("#wrapper #content .contentMain #center #left #leftBottom #picList ul");

        var imgs = goodData.imagessrc;

        for (let i = 0; i < imgs.length; i++) {
            var newImg = document.createElement('img');
            newImg.src = imgs[i].s;
            var li = document.createElement('li');
            li.appendChild(newImg);
            ul.appendChild(li);
        }
    }

    //点击缩略图的效果
    thumbnailClick()

    function thumbnailClick() {
        /*
         * 1.获取所有的li元素, 并且循环发生点击事件
         * 2.点击缩略图需要确定其小图路径和大图路径,并且替换现有的src值
         *
         * */
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li')

        var smallImg = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img')

        var ImgSrc = goodData.imagessrc

        //小图路径需要默认和imagessrc的第一个元素一致
        smallImg.src = ImgSrc[0].s;
        for (let i = 0; i < liNodes.length; i++) {
            //点击这些事件之前, 给每个元素都添加上自定义的下标
            liNodes[i].index = i;
            liNodes[i].onclick = function() {
                var idx = this.index; /** 事件函数的this永远指向的是实际发生事件的目标源对象*/
                bigImgIndex = idx;

                //变换小图路径
                smallImg.src = ImgSrc[bigImgIndex].s;
            }
        }
    }

    //点击缩略图箭头的效果
    thumbnailLeftRightClick();

    function thumbnailLeftRightClick() {
        /*
        思路:
            1.获取左右两端的箭头
            2.再获取可视的div以及ul元素和所有的li元素
            3.然后再发生点击事件 (计算发生起点和步长,总体运动的距离值)
         */
        //获取箭头函数
        var pre = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev')
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next')
            //2.再获取可视的div以及ul元素和所有的li元素

        var piclist = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList')

        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul')

        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li')

        var start = 0;
        //计算步长
        var step = (liNodes[0].offsetWidth + 20) * 2
            // console.log(step);

        //总体能够运动的距离值=ul的宽度-div框的宽度=(图片总数-div显示的图片数量)*(li的宽度+20)
        var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20)

        //发生事件
        pre.onclick = function() {
            start -= step
            if (start < 0) {
                start = 0
            }
            ul.style.left = -start + 'px'
        }
        next.onclick = function() {
            start += step;
            if (start > endPosition) {
                start = endPosition
            }
            ul.style.left = -start + 'px'
        }
    }

    //商品详情数据的动态渲染
    rightTopData()

    function rightTopData() {
        /*
         * 查找rightTop元素
         * 在data.js中找到对应的数据
         * 建立字符串变量,将原来的布局结构贴进来,将所对应的数据放在对应的位置上重新渲染rightTop元素
         *
         * */

        var rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop')

        var goodsDetail = goodData.goodsDetail
            // console.log(goodsDetail)
            //模板字符串替换数据: ${变量}
        var s = ` <h3>${goodsDetail.title}</h3>
                            <p>${goodsDetail.recommend}</p>
                            <div class="priceWrap">
                                <div class="priceTop">
                                    <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                                    <div class="price">
                                        <span>¥</span>
                                        <p>${goodsDetail.price}</p>
                                        <i>降价通知</i>
                                    </div>
                                    <p>
                                        <span>累计评价</span>
                                        <span>670000</span>
                                    </p>
                                </div>
                                <div class="priceBottom">
                                    <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                                    <p>
                                        <span>${goodsDetail.promoteSales.type}</span>
                                        <span>${goodsDetail.promoteSales.content}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="support">
                                <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                                <p>${goodsDetail.support}</p>
                            </div>
                            <div class="address">
                                <span>配&nbsp;送&nbsp;至</span>
                                <p>${goodsDetail.address}</p>
                            </div>`;
        rightTop.innerHTML = s;
    }

    //商品数据参数的动态渲染
    rightBottomData();

    function rightBottomData() {
        /*
         * 找到rightBottom元素对象
         * 查找data.js中的goodsDetail.crumbData[i].对应的属性
         * 由于数据是一个数组,需要遍历,有一个元素则需要有有一个动态的dl元素
         * */
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap')

        var crumbData = goodData.goodsDetail.crumbData;

        for (let i = 0; i < crumbData.length; i++) {
            //创建动态的dl元素对象
            var dlNode = document.createElement('dl');

            //创建dt对象
            var dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title

            //dl追加dt
            dlNode.appendChild(dtNode);

            //继续遍历数组创建dd元素
            for (let j = 0; j < crumbData[i].data.length; j++) {
                var ddNode = document.createElement('dd')
                ddNode.innerText = crumbData[i].data[j].type
                ddNode.setAttribute('priceChange', crumbData[i].data[j].changePrice)
                dlNode.appendChild(ddNode)
            }

            //让chooseWrap追加dl
            chooseWrap.appendChild(dlNode)
        }

    }

    //点击商品参数之后的颜色排他效果以及展示点击的商品参数,以及删除效果
    clickddBind()

    function clickddBind() {
        /*
         * 获取所有的dl元素, 取其中的第一个dl元素下的所有dd先做测试, 测试完毕后嵌套循环
         * 循环所有的dd元素并且添加点击事件
         * 确定实际发生事件的目标源对象并设置为红色然后给其他所有元素颜色都重置为基础颜色
         *
         * 点击dd后产生Mark标记并展示:
         * 首先创建一个可以容纳dd元素值的容器(数组), 确定数组的长度
         * 然后再将点击的dd元素的值按照对应下标来写到数组的元素身上
         * */
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap dl')
            // console.log(dlNodes)

        var arr = new Array(dlNodes.length);
        arr.fill(0);

        var chosen = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chosen')

        for (let i = 0; i < dlNodes.length; i++) {
            let ddNodes = dlNodes[i].querySelectorAll('dd');
            for (let k = 0; k < ddNodes.length; k++) {
                ddNodes[k].onclick = function() {
                    //清空之前点击产生的mark
                    chosen.innerHTML = '';
                    for (let j = 0; j < ddNodes.length; j++) {
                        ddNodes[j].style.color = '#666';
                    }
                    this.style.color = "red";
                    // 点击哪一个dd元素, 产生动态的参数标签
                    arr[i] = this;

                    priceChange(arr);
                    // console.log(arr);
                    arr.forEach(function(value, index) {
                            if (value) {
                                let markDiv = document.createElement('div');
                                markDiv.className = 'mark';
                                markDiv.innerText = value.innerText;
                                let a = document.createElement('a');
                                //每一个被选择的属性的下标值都要与dl的下标值对应, 通过index
                                a.setAttribute('index', index)
                                a.innerText = 'X';
                                markDiv.appendChild(a);
                                chosen.appendChild(markDiv);
                            }
                        })
                        //    获取所有的a标签, 并循环发生点击事件(添加删除效果)
                    var aNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .chosen .mark a')
                    for (let j = 0; j < aNodes.length; j++) {
                        aNodes[j].onclick = function() {
                            let index = this.getAttribute('index');

                            //查找对应下标的dl行的所有dd元素
                            var ddList = dlNodes[index].querySelectorAll('dd')
                                //遍历所有的dd
                            for (let l = 0; l < ddList.length; l++) {
                                //点击删除后默认第一个dd为红色,其他dd的元素颜色均为默认
                                ddList[l].style.color = '#666';
                            }
                            ddList[0].style.color = 'red';
                            chosen.removeChild(this.parentNode);
                            //删除对应下标的元素后, 原数组相应下标的值也要改为0
                            arr[index] = 0;

                            //调用价格变动函数
                            priceChange(arr);
                        }
                    }

                }
            }
        }
    }
    //价格变动函数

    // 据说是最难得
    function priceChange(arr) {
        /*
         * 思路:
         * 无论点击什么参数, 最终的价格都是显示在价格上,因此首先需要找到价格元素
         *给每一个dd标签上都默认设置一个属性, 用来记录变化的价格
         *遍历arr数组, 将dd元素身上的新变化的价格加到原本的price上
         * */
        let price = document.querySelector('#wrapper #content .contentMain #center .right .rightTop .priceWrap .priceTop .price p')
            //提出默认的price
        let oldPrice = goodData.goodsDetail.price;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                let changes = Number(arr[i].getAttribute('priceChange'))
                oldPrice += changes;
            }
        }
        price.innerText = oldPrice;

        //将变化后的价格写入左侧标签中
        var leftPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .chooseBox .listWrap .left p')
        leftPrice.innerText='¥'+price.innerText;
        var rightPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .chooseBox .right i')
        //判断是否选择其他配套商品, 若选中则加上,未选中则和左侧价格一致
        var inputs=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .chooseBox .middle div input')
        for (let i = 0; i <inputs.length; i++) {
            if(inputs[i].checked){
                oldPrice+=Number(inputs[i].value)
            }
        }
        rightPrice.innerText='¥'+oldPrice;

    }
    //选择搭配中间区域复选框选中套餐价变动效果
    choosePrice();
    function choosePrice(){
        /**
         * 思路:
         * 先获取其中所有的复选框元素
         * 遍历, 点中几个就将套餐价加相应的价格
         * 累加后重新写回标签中
         */
        var inputs=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .chooseBox .middle div input')
        var leftPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .chooseBox .listWrap .left p')
        var newPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .chooseBox .right i')
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].onclick=function (){
                let oldPrice=Number(leftPrice.innerText.slice(1));
                for (let j = 0; j < inputs.length; j++) {
                    if(inputs[j].checked){
                        oldPrice=oldPrice+Number(inputs[j].value);
                    }

                }
                //累加后重新写回标签中
                newPrice.innerText='¥'+oldPrice;

            }
        }

    }

    //封装一个公共的选项卡函数
    /**
     * 1需要被点击的元素 tabBtns
     * 被切换显示的元素 tabConts
     *
     */
    function Tab(tabBtns,tabConts){
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].index=i;
            tabBtns[i].onclick=function (){
                for (let j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className='';
                    tabConts[j].className='';
                }
                this.className='active';
                tabConts[this.index].className='active';
            }
        }


    }

    //点击左侧选项卡
    leftTab();
    function leftTab(){
        let h4s=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailsWrap .leftAside .asideTop h4');

        let divs=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailsWrap .leftAside .asideBottom>div');
        Tab(h4s,divs)
    }


    //点击右侧选项卡
    rightTab()
    function rightTab(){
        let lis=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .bottomDetail .tabBtns li')

        let divs=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailsWrap .rightDetails .bottomDetail .tabContents >div')

        Tab(lis,divs);
    }


    //右边侧边栏的点击效果
    rightClick();
    function rightClick(){
        /**
         * 先找到按钮元素,发生点击事件
         */
        let btn=document.querySelector('#wrapper .rightAside .btns')
        //记录初始状态
        let flag=true;//关闭

        //查找侧边栏元素
        let rightAside=document.querySelector('#wrapper .rightAside')

        //发生点击事件
        btn.onclick=function (){
            console.log(1)
            //判断
            if(flag){
                //展开
                btn.className='btns open';

                rightAside.className='rightAside asideOpen';
            }else{
                //关闭
                btn.className='btns Close';

                rightAside.className='rightAside asideClose';

            }
            flag=!flag

        }
    }



}