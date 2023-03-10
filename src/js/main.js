function ajaxCall() {
  this.send = function (data, url, method, success, type) {
    type = "json";
    const successRes = function (data) {
      success(data);
    };

    const errorRes = function (xhr, ajaxOptions, thrownError) {
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
  const rootUrl = "https://geodata.phplift.net/api/index.php";
  const call = new ajaxCall();
  this.getCities = function (id, select_city) {
    jQuery(".cities option:gt(0)").remove();
    //get additional fields

    var url = rootUrl + "?type=getCities&countryId=" + "&stateId=" + id;
    var method = "post";
    var data = {};
    call.send(data, url, method, function (data) {
      title = jQuery(".cities").find("option:eq(0)").val();
      state = jQuery(".states").children("option").filter(":selected").val();
      console.log("title.........", title);
      if (state == "Ontario") {
        jQuery(".cities").find("option:eq(0)").html("Mississauga");
      } else {
        jQuery(".cities").find("option:eq(0)").html("Select City");
      }
      $("#cityId").each(function () {
        $(this).select2({
          theme: "bootstrap-5",
          dropdownParent: $(this).parent(),
        });
      });
      const listlen = Object.keys(data["result"]).length;

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
    const stateClasses = jQuery("#stateId").attr("class");

    var url = rootUrl + "?type=getStates&countryId=" + id;
    var method = "post";
    var data = {};
    jQuery(".states").find("option:eq(0)").html("loading.....");
    call.send(data, url, method, function (data) {
      jQuery(".states").find("option:eq(0)").html("Ontario");
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
    jQuery.each(searchedArray, function (key, val) {
      var option = jQuery("<option />");

      option.attr("value", val.name).text(val.name);
      option.attr("countryid", val.id);

      jQuery("#countryId").append(option);
    });
  };
}
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
    var loc = new locationInfo();
    loc.getStates(39);
    loc.getCities(866, true);
    var page_name = window.location.href.split("/").pop();
    var active_page = page_name.split(".")[0];
    $(".nav-item")
      .find("#" + active_page)
      .addClass("active");
    $(".nav-item a").click(function () {
      $(".nav-item a.active").removeClass("active");
      $(".nav-item")
        .find("#" + active_page)
        .addClass("active");
    });
  });
  jQuery(".states").on("change", function (ev) {
    const stateId = jQuery("option:selected", this).attr("stateid");
    jQuery(".cities").find("option:eq(0)").html("Select City");
    if (stateId != "") {
      if (stateId == 866) {
        loc.getCities(stateId, true);
      } else {
        loc.getCities(stateId, false);
      }
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
