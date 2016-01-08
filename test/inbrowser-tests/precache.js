/*
  Copyright 2014 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// This is a test and we want descriptions to be useful, if this
// breaks the max-length, it's ok.

/* eslint-disable max-len, no-lonely-if */
/* eslint-env browser, mocha */

'use strict';

window.chai.should();
var testHelper = window.SWTestHelper;

function compareCachedAssets(assetList, cachedAssets) {
  return new Promise((resolve, reject) => {
    var cachedAssetsKeys = Object.keys(cachedAssets);
    cachedAssetsKeys.should.have.length(assetList.length);

    for (var i = 0; i < assetList.length; i++) {
      var key = location.origin + assetList[i];
      if (typeof cachedAssets[key] === 'undefined') {
        reject(new Error('Cache doesn\'t have a cache item for: ' + key));
      }

      // TODO: Check the contents of the cache matches the data files?
    }

    resolve();
  });
}

describe('Test precache method', () => {
  it('should precache all desired assets in precache-valid', done => {
    var assetList = [
      '/test/data/files/text.txt',
      '/test/data/files/image.png'
    ];
    testHelper.activateSW('/test/serviceworkers/precache/valid.js')
    .then(() => {
      return testHelper.getAllCachedAssets('precache-valid');
    })
    .then(cachedAssets => {
      return compareCachedAssets(assetList, cachedAssets);
    })
    .then(() => done(), done);
  });

  it('should not precache paths that do no exist', done => {
    var testId = 'precache-non-existant-files';
    var validAssetsList = [
      '/test/data/files/text.txt',
      '/test/data/files/image.png'
    ];
    testHelper.activateSW('/test/serviceworkers/precache/non-existant-files.js')
    .then(() => {
      return testHelper.getAllCachedAssets(testId);
    })
    .then(cachedAssets => {
      return compareCachedAssets(validAssetsList, cachedAssets);
    })
    .then(() => done(), done);
  });

  it('should precache all assets from each install step', done => {
    var toolboxAssetList = [
      '/test/data/files/text.txt',
      '/test/data/files/image.png'
    ];
    var additionalInstallAssets = [
      '/test/data/files/text-1.txt',
      '/test/data/files/text-2.txt'
    ];
    testHelper.activateSW('/test/serviceworkers/precache/custom-install.js')
    .then(() => {
      return testHelper.getAllCachedAssets('precache-custom-install-toolbox');
    })
    .then(cachedAssets => {
      return compareCachedAssets(toolboxAssetList, cachedAssets);
    })
    .then(() => {
      return testHelper.getAllCachedAssets('precache-custom-install');
    })
    .then(cachedAssets => {
      return compareCachedAssets(additionalInstallAssets, cachedAssets);
    })
    .then(() => done(), done);
  });
});
