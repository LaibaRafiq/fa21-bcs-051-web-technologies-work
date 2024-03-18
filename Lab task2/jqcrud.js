function displayItems() {
  $.ajax({
    url: "https://65f7fcacb4f842e808868ec6.mockapi.io/myplants/plants",
    method: "GET",
    dataType: "json",
    success: function (data) {
      var itemsList = $("#storiesList");
      itemsList.empty();

      $.each(data, function (index, item) {
        var card = $(`
          <div class="card">
              <h3>${item.name}</h3>
              <p>Specie: ${item.specie}</p>
              <p>Price: ${item.price}</p>
              <div>${item.description}</div>
              <div>
                  <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${item.id}">Edit</button>
                  <button class="btn btn-danger btn-sm btn-del" data-id="${item.id}">Delete</button>
              </div>
          </div>
        `);
        itemsList.append(card);
      });
    },
    error: function (error) {
      console.error("Error fetching items:", error);
    },
  });
}

 // Function to delete a story
 function deleteItem() {
  let itemId = $(this).attr("data-id");
  $.ajax({
    url: "https://65f7fcacb4f842e808868ec6.mockapi.io/myplants/plants/" +itemId, 
    method: "DELETE",
    success: function () {
      displayItems();
    },
    error: function (error) {
      console.error("Error deleting item:", error);
    },
  });
}
function editBtnClicked(event) {
  event.preventDefault();
  let itemId = $(this).attr("data-id");
  $.ajax({
      url: `https://65f7fcacb4f842e808868ec6.mockapi.io/myplants/plants/${itemId}`, 
      method: "GET",
      success: function (data) {
          console.log(data);
          $("#clearBtn").show();
          $("#createName").val(data.name);
          $("#createSpecie").val(data.specie);
          $("#createPrice").val(data.price);
          $("#createDescription").val(data.description);
          // Set the data-id attribute of the submit button to the item ID
          $("#createBtn").attr("data-id", itemId); // corrected itemId variable
          // Change the button text to "Update" to indicate editing mode
          $("#createBtn").html("Update");
      },
      error: function (error) {
          console.error("Error fetching item details:", error);
      },
  });
}
function handleFormSubmission(event) {
  event.preventDefault();
  let itemId = $("#createBtn").attr("data-id"); // Get the item ID from the submit button data-id attribute
  var name = $("#createName").val();
  var specie = $("#createSpecie").val();
  var price = $("#createPrice").val();
  var description = $("#createDescription").val();

  if (itemId) { // If editing an existing item
      $.ajax({
          url: "https://65f7fcacb4f842e808868ec6.mockapi.io/myplants/plants/" + itemId,
          method: "PUT", // Use PUT method to update the item
          data: { name, specie, price, description },
          success: function () {
              displayItems(); // Refresh the list after updating
              resetForm(); // Reset the form fields
          },
          error: function (error) {
              console.error("Error updating item:", error);
          },
      });
  } else { // Creating a new item
      $.ajax({
          url: "https://65f7fcacb4f842e808868ec6.mockapi.io/myplants/plants",
          method: "POST",
          data: { name, specie, price, description },
          success: function () {
              displayItems(); // Refresh the list after creating
              resetForm(); // Reset the form fields
          },
          error: function (error) {
              console.error("Error creating item:", error);
          },
      });
  }
}



function resetForm() {
  $("#clearBtn").hide();
  $("#createBtn").removeAttr("data-id").html("Create");
  $("#createName, #createSpecie, #createPrice, #createDescription").val("");
}
  $(document).ready(function () {
    // Initial display of items
    displayItems();
    $(document).on("click", ".btn-del", deleteItem);
    $(document).on("click", ".btn-edit", editBtnClicked);
    $("#createForm").submit(handleFormSubmission);
    $("#clearBtn").click(resetForm);
    $("#clearBtn").on("click", function (e) {
        e.preventDefault();
        $("#clearBtn").hide();
        $("#createBtn").removeAttr("data-id");
        $("#createBtn").html("Create");
        
        $("#createName").val("");
        $("#createSpecie").val("");
        $("#createPrice").val("");
        $("#createDescription").val("");
    });
  });