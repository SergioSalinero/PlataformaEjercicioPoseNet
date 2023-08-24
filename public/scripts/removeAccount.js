/**
 * Allows to user remove his account.
 * @namespace
 * @name removeAccount
 */


/**
 * Initialises basic paramameters.
 *
 * @param {string} id - The user ID.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof removeAccount
 */
window.addEventListener('load', () => {
	const id = document.getElementById('id').innerHTML;
	const userID = document.getElementById('userID');
	userID.value = id;

	const back = document.getElementById('back');
	back.href = '/profile?id=' + id;
})
