(
  function ()
  {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function")
    {
      ic("reattach_activator");
      if (w.intercomSettings && w.intercomSettings.app_id)
      {
        ic("update", w.intercomSettings);
      }
      else
      {
        ic("update", {
          app_id: "yz9qn6p3",
          api_base: "https://api-iam.intercom.io"
        });
      }
    }
    else
    {
      var d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function () {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/yz9qn6p3";
        var x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === "complete") {
        l();
      } else if (w.attachEvent) {
        w.attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  }
)();
