function ajaxCall() {
  this.send = function (data, url, method, success, type) {
    type = "json";
    var successRes = function (data) {
      success(data);
    };

    var errorRes = function (xhr, ajaxOptions, thrownError) {
      console.log(
        thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText
      );
    };
    jQuery.ajax({
      url: url,
      type: method,
      data: data,
      success: successRes,
      error: errorRes,
      dataType: type,
      timeout: 60000,
    });
  };
}

function locationInfo() {
  var rootUrl = "https://geodata.phplift.net/api/index.php";
  var call = new ajaxCall();
  this.getCities = function (id) {
    jQuery(".cities option:gt(0)").remove();
    //get additional fields

    var url = rootUrl + "?type=getCities&countryId=" + "&stateId=" + id;
    var method = "post";
    var data = {};
    jQuery(".cities").find("option:eq(0)").html("loading.....");
    call.send(data, url, method, function (data) {
      jQuery(".cities").find("option:eq(0)").html("Select City");
      $("#cityId").each(function () {
        $(this).select2({
          theme: "bootstrap-5",
          dropdownParent: $(this).parent(),
        });
      });
      var listlen = Object.keys(data["result"]).length;

      if (listlen > 0) {
        jQuery.each(data["result"], function (key, val) {
          var option = jQuery("<option />");
          option.attr("value", val.name).text(val.name);
          jQuery(".cities").append(option);
        });
      }

      jQuery(".cities").prop("disabled", false);
    });
  };

  this.getStates = function (id) {
    jQuery(".states option:gt(0)").remove();
    jQuery(".cities option:gt(0)").remove();
    //get additional fields
    var stateClasses = jQuery("#stateId").attr("class");

    var url = rootUrl + "?type=getStates&countryId=" + id;
    var method = "post";
    var data = {};
    jQuery(".states").find("option:eq(0)").html("loading.....");
    call.send(data, url, method, function (data) {
      jQuery(".states").find("option:eq(0)").html("Select State");
      $("#stateId").each(function () {
        $(this).select2({
          theme: "bootstrap-5",
          dropdownParent: $(this).parent(),
        });
      });
      jQuery.each(data["result"], function (key, val) {
        var option = jQuery("<option />");
        option.attr("value", val.name).text(val.name);
        option.attr("stateid", val.id);
        jQuery(".states").append(option);
      });
      jQuery(".states").prop("disabled", false);
    });
  };

  countries = [];
  searchedArray = [];

  this.getCountries = function () {
    var url = rootUrl + "?type=getCountries";
    var method = "post";
    var data = {};
    // jQuery(".countries").find("option:eq(0)").html("Please wait..");
    call.send(data, url, method, function (data) {
      this.countries = data?.result;
      this.searchedArray = data?.result;

      console.log("countiress.......", this.countries);
      // jQuery(".countries").find("option:eq(0)").html("Canada");

      jQuery.each(searchedArray, function (key, val) {
        var option = jQuery("<option />");

        option.attr("value", val.name).text(val.name);
        option.attr("countryid", val.id);

        jQuery("#countryId").append(option);
      });
      // jQuery(".countries").prop("disabled",false);
    });
  };
}
$(document).ready(function () {
  var loc = new locationInfo();
  loc.getStates(39);
});
jQuery(function () {
  var loc = new locationInfo();
  loc.getCountries();
  jQuery(".countries").on("change", function (ev) {
    var countryId = jQuery("option:selected", this).attr("countryid");
    if (countryId != "") {
      loc.getStates(countryId);
    } else {
      jQuery(".states option:gt(0)").remove();
    }
  });
  $(document).ready(function () {
    loc.getCities(866);
  });
  jQuery(".states").on("change", function (ev) {
    var stateId = jQuery("option:selected", this).attr("stateid");
    if (stateId != "") {
      loc.getCities(stateId);
    } else {
      jQuery(".cities option:gt(0)").remove();
    }
  });
});
// CHART
if (typeof Chart != "undefined") {
  var xValues = ["Comp", "Used"];
  var yValues = [50, 20];
  var barColors = ["#b91d47", "#00aba9"];

  new Chart("myChart", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Status",
      },
    },
  });
}
