/**
 * Helpers
 */
export default {
  /**
   * Compare two attribute lists
   * @param a1
   * @param a2
   * @returns {boolean}
   */
  compareAttributes: (a1, a2) => {
    if (a1 instanceof Array && a2 instanceof Array) {
      if (a1.length !== a2.length) {
        return false;
      }

      for (let i = 0, l = a1.length; i < l; i += 1) {
        if (a1[i] !== a2[i]) return false;
      }
    } else {
      return a1 === a2;
    }

    return true;
  },
};
