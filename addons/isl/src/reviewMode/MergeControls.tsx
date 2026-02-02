/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {DiffSummary} from '../types';
import type {MergeStrategy} from '../operations/MergePROperation';

import {Button} from 'isl-components/Button';
import {Dropdown} from 'isl-components/Dropdown';
import {Icon} from 'isl-components/Icon';
import {Tooltip} from 'isl-components/Tooltip';
import {useAtomValue} from 'jotai';
import {useState, useCallback} from 'react';
import {diffSummary} from '../codeReview/CodeReviewInfo';
import {useRunOperation} from '../operationsState';
import {MergePROperation} from '../operations/MergePROperation';
import {CIStatusBadge} from './CIStatusBadge';
import {
  deriveMergeability,
  formatMergeBlockReasons,
  mergeInProgressAtom,
} from './mergeState';
import {writeAtom} from '../jotaiUtils';
import {showToast} from '../toast';
import './MergeControls.css';

export type MergeControlsProps = {
  prNumber: string;
};

const MERGE_STRATEGIES: {value: MergeStrategy; label: string}[] = [
  {value: 'squash', label: 'Squash and merge'},
  {value: 'merge', label: 'Create merge commit'},
  {value: 'rebase', label: 'Rebase and merge'},
];

/**
 * Type guard to check if a DiffSummary is a GitHubDiffSummary.
 * DiffSummary is a union type: GitHubDiffSummary | PhabricatorDiffSummary
 * GitHubDiffSummary has type: 'github', PhabricatorDiffSummary has type: 'phabricator'
 */
function isGitHubDiffSummary(pr: DiffSummary): pr is DiffSummary & {type: 'github'} {
  return pr.type === 'github';
}

/**
 * Merge controls panel for review mode.
 * Shows CI status (MRG-01), strategy selection (MRG-02), and merge button (MRG-03).
 */
export function MergeControls({prNumber}: MergeControlsProps) {
  const [strategy, setStrategy] = useState<MergeStrategy>('squash');
  const [deleteBranch, setDeleteBranch] = useState(false);
  const runOperation = useRunOperation();
  const mergeInProgress = useAtomValue(mergeInProgressAtom);

  // Get PR data for CI status and mergeability
  // diffSummary returns Result<DiffSummary | undefined>
  const prData = useAtomValue(diffSummary(prNumber));
  const pr = prData?.value;

  // Check if we're currently merging this PR
  const isMerging = mergeInProgress === prNumber;

  // Derive mergeability - use type guard for GitHub-specific fields
  const mergeability = pr
    ? deriveMergeability({
        signalSummary: pr.signalSummary,
        // Use type guard to safely access GitHub-specific fields
        reviewDecision: isGitHubDiffSummary(pr) ? pr.reviewDecision : undefined,
        mergeable: isGitHubDiffSummary(pr) ? pr.mergeable : undefined,
        mergeStateStatus: isGitHubDiffSummary(pr) ? pr.mergeStateStatus : undefined,
        state: isGitHubDiffSummary(pr) ? pr.state : undefined,
      })
    : {canMerge: false, reasons: ['Loading PR data...']};

  const handleMerge = useCallback(async () => {
    if (!mergeability.canMerge || isMerging) {
      return;
    }

    writeAtom(mergeInProgressAtom, prNumber);

    try {
      await runOperation(new MergePROperation(Number(prNumber), strategy, deleteBranch));
      showToast(`PR #${prNumber} merged successfully`, {durationMs: 5000});
    } catch (error) {
      showToast(`Failed to merge PR: ${error}`, {durationMs: 8000});
    } finally {
      writeAtom(mergeInProgressAtom, null);
    }
  }, [prNumber, strategy, deleteBranch, mergeability.canMerge, isMerging, runOperation]);

  if (!pr) {
    return (
      <div className="merge-controls merge-controls-loading">
        <Icon icon="loading" /> Loading...
      </div>
    );
  }

  // Get CI checks - only available on GitHub PRs
  const ciChecks = isGitHubDiffSummary(pr) ? pr.ciChecks : undefined;

  return (
    <div className="merge-controls">
      <div className="merge-controls-status">
        <CIStatusBadge
          signalSummary={pr.signalSummary}
          ciChecks={ciChecks}
        />
      </div>

      <div className="merge-controls-actions">
        <div className="merge-strategy-select">
          <Dropdown
            options={MERGE_STRATEGIES.map(({value, label}) => ({value, name: label}))}
            value={strategy}
            onChange={(e) => setStrategy(e.currentTarget.value as MergeStrategy)}
            disabled={isMerging}
          />
        </div>

        <label className="merge-delete-branch">
          <input
            type="checkbox"
            checked={deleteBranch}
            onChange={(e) => setDeleteBranch(e.target.checked)}
            disabled={isMerging}
          />
          Delete branch after merge
        </label>

        <Tooltip
          title={
            mergeability.canMerge
              ? `Merge PR #${prNumber}`
              : formatMergeBlockReasons(mergeability.reasons)
          }
          placement="bottom">
          <Button
            primary
            disabled={!mergeability.canMerge || isMerging}
            onClick={handleMerge}>
            {isMerging ? (
              <>
                <Icon icon="loading" slot="start" />
                Merging...
              </>
            ) : (
              <>
                <Icon icon="git-merge" slot="start" />
                Merge
              </>
            )}
          </Button>
        </Tooltip>
      </div>

      {!mergeability.canMerge && (
        <div className="merge-block-reasons">
          {mergeability.reasons.map((reason, i) => (
            <div key={i} className="merge-block-reason">
              <Icon icon="warning" size="S" />
              {reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
