const sortIntoCategories = (whiskys) => {
  // Create an empty object to store the transformed result
  const transformedResult = {};

  // Iterate through the actual result array
  whiskys.forEach((whisky) => {
    // Extract relevant information
    const { whisky_id, name, price, area, area_id } = whisky

    // Check if the area exists in the transformed result object
    if (!transformedResult[area]) {
      // If not, create a new entry for the area
      transformedResult[area] = {
        id: area_id,
        area: area,
        total: 0,
        products: [],
      }
    }

    // Add the beer details to the products array of the area
    transformedResult[area].products.push({
      id: whisky_id,
      name: name,
      price: price,
      area: area,
    })
  })

  // Convert the transformed result into an array
  const transformedArray = Object.values(transformedResult)

  // Sort the array by id
  transformedArray.sort((a, b) => a.id - b.id)

  // Sort the products array of each area by id
  transformedArray.forEach((area) => {
    area.products.sort((a, b) => a.id - b.id)
  })

  // add a total amount of products to each area
  transformedArray.forEach((area) => {
    area.total = area.products.length
  })

  return transformedArray
}

module.exports = {
  sortIntoCategories,
}