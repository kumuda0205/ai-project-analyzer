export async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { status: 'error', apiKeyConfigured: false };
    }
    return await res.json();
  } catch (err) {
    return { status: 'offline', apiKeyConfigured: false, error: err.message };
  }
}

export async function analyzeProjectZip(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/projects/analyze', {
    method: 'POST',
    body: formData,
  });

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to analyze project ZIP file.');
    }
    return json.data;
  } else {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 150)}`);
  }
}
