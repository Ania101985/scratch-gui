import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Blockly from 'scratch-blocks'; // scratch-blocks exposes Blockly API

const ProgressChecker = ({vm}) => {
    const [isLessonComplete, setIsLessonComplete] = useState(false);

    useEffect(() => {
        const workspace = Blockly.getMainWorkspace();

        const onWorkspaceChange = () => {
            const blocks = workspace.getAllBlocks(false);
            const result = checkLessonBlocks(blocks);
            setIsLessonComplete(result);
        };

        workspace.addChangeListener(onWorkspaceChange);

        // Cleanup listener when component unmounts
        return () => {
            workspace.removeChangeListener(onWorkspaceChange);
        };
    }, [vm]);

    const checkLessonBlocks = (blocks) => {
        // Example advanced check:
        // Look for: "controls_repeat" block with nested "motion_movesteps" block, value = 10

        // 1️⃣ Find repeat block
        const repeatBlocks = blocks.filter(block => block.type === 'control_repeat');
        if (repeatBlocks.length !== 1) return false; // Require exactly 1 repeat

        const repeatBlock = repeatBlocks[0];

        // 2️⃣ Check nested blocks inside repeat
        const statementInput = repeatBlock.getInputTargetBlock('SUBSTACK');
        if (!statementInput) return false; // No nested block

        // 3️⃣ Check if nested block is move steps with correct value
        if (statementInput.type !== 'motion_movesteps') return false;

        const stepsValue = statementInput.getFieldValue('STEPS');
        if (parseInt(stepsValue) !== 10) return false; // Require "move 10 steps"

        // Optional: check no extra blocks
        if (blocks.length !== 2) return false; // Expect exactly 2 blocks: repeat + move

        return true; // Lesson is correct!
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            padding: '10px',
            backgroundColor: '#fff',
            border: '2px solid #ccc',
            borderRadius: '8px',
            zIndex: 1000
        }}>
            <button
                disabled={!isLessonComplete}
                style={{
                    fontSize: '16px',
                    padding: '10px 20px',
                    backgroundColor: isLessonComplete ? '#4CAF50' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isLessonComplete ? 'pointer' : 'not-allowed'
                }}
                onClick={() => {
                    alert('Next lesson!');
                    // You can call your LMS API here to progress the student
                }}
            >
                Next
            </button>
        </div>
    );
};

ProgressChecker.propTypes = {
    vm: PropTypes.object.isRequired
};

export default ProgressChecker;

