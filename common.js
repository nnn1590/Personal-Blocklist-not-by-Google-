let blocklist = {};

blocklist.common = {};

blocklist.common.GET_BLOCKLIST        = 'getBlocklist';
blocklist.common.ADD_TO_BLOCKLIST      = 'addToBlocklist';
blocklist.common.DELETE_FROM_BLOCKLIST = 'deleteFromBlocklist';

blocklist.common.HOST_REGEX = new RegExp(
  '^https?://(www[.])?([0-9a-zA-Z.-]+).*$');

blocklist.common.SUB_DIRECTORY_REGEX = new RegExp(
    '^https?://(www[.])?([0-9a-zA-Z.-]+/[0-9a-zA-Z.-]+/).*$');


blocklist.common.SUB_DIRECTORY_SERVICE = [
  "blog.livedoor.jp","plaza.rakuten.co.jp","ameblo.jp","blogs.yahoo.co.jp",
  "blog.goo.ne.jp","d.hatena.ne.jp","lineblog.me","note.mu",
  "qiita.com"
];

blocklist.common.startBackgroundListeners = function() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type == blocklist.common.GET_BLOCKLIST) {
        let blocklistPatterns = [];
        if (!localStorage.blocklist) {
          localStorage['blocklist'] = JSON.stringify(blocklistPatterns);
        } else {
          blocklistPatterns = JSON.parse(localStorage['blocklist']);
        }
        sendResponse({
          blocklist: blocklistPatterns
        });
      } else if (request.type == blocklist.common.ADD_TO_BLOCKLIST ) {
        let blocklists = JSON.parse(localStorage['blocklist']);
        if (blocklists.indexOf(request.pattern) == -1) {
          blocklists.push(request.pattern);
          blocklists.sort();
          localStorage['blocklist'] = JSON.stringify(blocklists);
        }
        sendResponse({
          success: 1,
          pattern: request.pattern
        });
      } else if (request.type == blocklist.common.DELETE_FROM_BLOCKLIST) {
        let blocklists = JSON.parse(localStorage['blocklist']);
        let index = blocklists.indexOf(request.pattern);
        if (index != -1) {
          blocklists.splice(index, 1);
          localStorage['blocklist'] = JSON.stringify(blocklists);
          sendResponse({
            pattern: request.pattern
          });
        }
      }
    }
  )
};

// 検索結果の下に表示する「example.comをブロックする」リンクのexample.comの部分の作成
// ex) https://example.com/hoge.html → example.com
// また、サブディレクトリドメインのブログサービス等の場合は以下の様に修正。
// ex) https://example.com/dir/hoge.html → example.com/dir/
blocklist.common.handleHostLinkHref = function(pattern) {
  let HostLinkPattern = pattern.replace(
    blocklist.common.HOST_REGEX, '$2');
  if(blocklist.common.SUB_DIRECTORY_SERVICE.indexOf(HostLinkPattern) == -1) {
    return HostLinkPattern;
  } else {
     HostLinkPattern = pattern.replace(
      blocklist.common.SUB_DIRECTORY_REGEX, '$2');
      return HostLinkPattern;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  blocklist.common.startBackgroundListeners();
}, false);
