import enable_replace_name_with_job from './name_to_job';
import test from './triggers/test';
import dsr from './triggers/ultimate/dsr';

enable_replace_name_with_job();
void Options.Triggers.push(dsr);
void Options.Triggers.push(test);
