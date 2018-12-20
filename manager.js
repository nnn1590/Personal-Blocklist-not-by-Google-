// ポップアップ(manager.html)が表示された時に読み込む。

blocklist.manager = {};

blocklist.manager.handleDeleteBlocklistResponse = function(response) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'refresh'
    });
  })
};

blocklist.manager.handleAddBlocklistResponse = function(response) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'refresh'
    });
  })
};

blocklist.manager.createBlocklistPattern = function(pattern) {
  var patRow = $(
    '<div style="display:flex;font-size:16px;margin:10px 0;padding:5px 0;border-bottom:1px solid #f2f2f2;"></div>');
  var patRowDeleteButton = $(
    '<div style="margin-right: 15px;"><span style="color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;">ブロックを解除</span></div>');
  patRowDeleteButton.appendTo(patRow);
  var patRowHostName = $(
    '<div>' + pattern + '<div>');
  patRowHostName.appendTo(patRow);

  patRowDeleteButton.click(function() {
    if ($(this).text() == "ブロックを解除") {
      chrome.runtime.sendMessage({
          type: blocklist.common.DELETE_FROM_BLOCKLIST,
          pattern: pattern
        },
        blocklist.manager.handleDeleteBlocklistResponse);
      $(this).html(
        '<span style="color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;">ブロックをする</span>');

    } else {
      chrome.runtime.sendMessage({
          type: blocklist.common.ADD_TO_BLOCKLIST,
          pattern: pattern
        },
        blocklist.manager.handleAddBlocklistResponse);
      $(this).html(
        '<span style="color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;">ブロックを解除</span>');
    }
  });
  return patRow;
}

blocklist.manager.handleAddBlocklistResponse = function(response) {
  chrome.runtime.sendMessage({
      type: blocklist.common.GET_BLOCKLIST
    },
    blocklist.manager.handleRefreshResponse);
}

blocklist.manager.hideCurrentHost = function() {
  let pattern = $("#current-host").text();
  chrome.runtime.sendMessage({
      'type': blocklist.common.ADD_TO_BLOCKLIST,
      'pattern': pattern
    },
    blocklist.manager.handleAddBlocklistResponse);
  $("#current-blocklink").html(
    '<p style="background:#dff0d8;color:#3c763d;padding:10px;"><b>' +
    pattern + '</b>はブロック済みです。</p>');
}

blocklist.manager.addBlockCurrentHostLink = function(blocklistPatterns) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    let pattern = blocklist.common.handleHostLinkHref(tabs[0].url)

    if (blocklistPatterns.indexOf(pattern) == -1) {
      $('#current-blocklink').html(
        '<a href="#"><span id="current-host">' + pattern +
        '</span>をブロックする</a>');
      $('#current-blocklink').click(blocklist.manager.hideCurrentHost);
    } else {
      $("#current-blocklink").html(
        '<p style="background:#dff0d8;color:#3c763d;padding:10px;"><b>' +
        pattern + '</b>はブロック済みです。</p>');
    };
  });
}

blocklist.manager.handleRefreshResponse = function(response) {
  $("#manager-pattern-list").show('fast');

  let listDiv = $('#manager-pattern-list');
  listDiv.empty();

  if (response.blocklist != undefined && response.blocklist.length > 0) {
    blocklist.manager.addBlockCurrentHostLink(response.blocklist);

    for (let i = 0; i < response.blocklist.length; i++) {
      var patRow = blocklist.manager.createBlocklistPattern(response.blocklist[i]);
      patRow.appendTo(listDiv);
    }
  } else {
    blocklist.manager.addBlockCurrentHostLink([]);
  }
}

blocklist.manager.refresh = function() {
  chrome.runtime.sendMessage({
      type: blocklist.common.GET_BLOCKLIST
    },
    blocklist.manager.handleRefreshResponse);
};

document.addEventListener('DOMContentLoaded', function() {
  blocklist.manager.refresh();
});
