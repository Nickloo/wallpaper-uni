module.exports = {
	/**
	 * 获取分类列表
	 * @@return {Object}
	 */
	async list() {
		const db = uniCloud.database(); //代码块为cdb
		const {
			data: list
		} = await db.collection("category").where({
			status: 1
		}).orderBy('sort', 'asc').get()

		return {
			errorCode: 0,
			data: list
		}
	}
}