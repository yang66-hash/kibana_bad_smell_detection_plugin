import React from 'react';
import { EuiPanel, EuiText } from '@elastic/eui';

export function BucketShapedUI() {
  return (
    <div style={styles.container}>
      <EuiPanel style={styles.bucket}>
        <EuiText>
          <h3>Bucket Style</h3>
          <p>This is a bucket-shaped UI element created with custom styles.</p>
        </EuiText>
      </EuiPanel>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Center the bucket in the viewport
  },
  bucket: {
    position: 'relative',
    width: '200px',
    height: '300px',
    backgroundColor: '#0079A5', // Bucket's color
    borderRadius: '50% 50% 10% 10%', // Shape the top to be round like a bucket
    overflow: 'hidden', // Hide overflowed content
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Optional: Add shadow for 3D effect
    padding: '20px',
    textAlign: 'center',
  },
};