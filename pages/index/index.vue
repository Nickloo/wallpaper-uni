<template>
	<view class="page--home">
		<view class="tabs-wrap">
			<up-tabs :list="categoryList" @change="changeCate"></up-tabs>
		</view>
		<view class="list-wrap">
			<up-list height="100%" @scrolltolower="scrolltolower">
				<view class="list-contaner">
					<view v-for="item in wallpaperList" :key="item.id" class="list-item">
						<image :src="item.url" mode="aspectFill" class="wallpaper-img"></image>
					</view>
				</view>
				<view class="loadmore-wrap">
					<up-loadmore :status="loadingStauts" />
				</view>
			</up-list>
		</view>
	</view>
</template>

<script setup>
	import {
		onPullDownRefresh
	} from '@dcloudio/uni-app'
	import {
		reactive,
		ref
	} from 'vue';
	const category = uniCloud.importObject('category', {
		customUI: true
	});
	const wallpaper = uniCloud.importObject('wallpaper', {
		customUI: true
	});

	// 分类列表
	const categoryList = ref([{
		name: '全部',
		_id: null
	}])
	// 壁纸列表
	const wallpaperList = ref([])

	// 分页数据
	const pagination = reactive({
		page: 1,
		pageSize: 10,
	})

	const query = reactive({
		categoryId: null
	})

	const loadingStauts = ref('loading') // loading - 加载中, nomore - 没有更多了, loadmore - 加载更多

	getCategoryList()
	refresh()

	onPullDownRefresh(() => {
		uni.stopPullDownRefresh()
		refresh()
	})

	/**
	 * 滑动到最底部
	 */
	function scrolltolower() {
		console.log('滑动到最底部了');
		loadmore()
	}

	/**
	 * 加载更多
	 */
	function loadmore() {
		if (loadingStauts.value == 'nomore') return
		pagination.page++
		getPageList()
	}

	function refresh() {
		wallpaperList.value = []
		pagination.page = 1
		getPageList()
	}

	/**
	 * 获取分类列表
	 */
	async function getCategoryList() {
		const {
			data
		} = await category.list()
		categoryList.value = [
			...categoryList.value, ...data
		]
	}

	/**
	 * 选择分类
	 * @param {Object} e
	 */
	function changeCate(e) {
		// 
		query.categoryId = e._id
		refresh()
	}

	/**
	 * 获取壁纸列表
	 */
	async function getPageList() {
		loadingStauts.value = 'loading'

		const {
			data
		} = await wallpaper.page({
			...pagination,
			...query
		})

		const {
			list,
			total
		} = data

		// 判断是否还有
		if (total > pagination.page * pagination.pageSize) {
			loadingStauts.value = 'loadmore'
		} else {
			loadingStauts.value = 'nomore'
		}
		
		wallpaperList.value = [...wallpaperList.value, ...list]
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.page--home {
		display: flex;
		flex-direction: column;
		height: 100%;

		.tabs-wrap {}

		.list-wrap {
			flex: 1;
			overflow: hidden;
			padding-top: 10rpx;

			.list-contaner {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 0 10px;
			}

			.list-item {
				display: flex;
				flex-direction: column;
				width: 340rpx;
				margin-bottom: 20rpx;
				align-items: center;
				border-radius: 12rpx;
				overflow: hidden;

				.wallpaper-img {
					width: 100%;
				}

				.wallpaper-name {
					margin-top: 10rpx;
				}
			}
		}

		.loadmore-wrap {
			padding-bottom: 10rpx;
		}

	}
</style>