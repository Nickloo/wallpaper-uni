module.exports = {
	/**
	 * 获取分类列表
	 * @param {Object} params
	 * @param {number} params.page
	 * @param {number} params.pageSize
	 * @param {any} params.categoryId
	 * @@return {Object}
	 */
	async page(params) {
		const {
			page = 1, pageSize = 20, categoryId
		} = params
		const db = uniCloud.database();
		const whereQuery = {
			status: 1,
		}

		if (categoryId) {
			whereQuery.categoryIds = db.command.in([categoryId])
		} else {
			const {
				data: categoryList
			} = await db.collection('category').where({
				status: 1
			}).get()

			whereQuery.categoryIds = db.command.in(categoryList.map(v => v._id))
		}

		// 查询
		const queryBuilder = db.collection('wallpaper').where(whereQuery)
		// 获取总条数
		const {
			total
		} = await queryBuilder.count()

		// 获取当前页列表
		const {
			data: list
		} = await queryBuilder.limit(pageSize).skip((page - 1) * pageSize).get()

		return {
			errorCode: 0,
			data: {
				list: list,
				total: total
			}
		}
	}
}