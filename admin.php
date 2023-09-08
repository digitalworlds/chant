<?php

$chant='62p9v6qon1ls1fwp';

if ($handle = opendir('/media/raid1/opnDB/master/'.$chant.'/link/users')) 
{
	for($i=0;$i<6;$i++)
			{
				$tot[$i]=0;
				for($j=0;$j<7;$j++)
				{
					$gtot[$i][$j]=0;
				}
			}
	
	echo '<table><tr><td>Photo</td><td>Name</td><td>e-mail</td><td>Locale</td></tr>';
    while (false !== ($entry = readdir($handle))) 
    {  
        if ($entry!='.' && $entry!='..')
		{
			$USER_ID=$entry;
			$user = json_decode(file_get_contents('/media/raid1/opnDB/master/'.$USER_ID.'/info'),true);
			echo '<tr>';
			echo '<td><img src="https://research.dwi.ufl.edu/op.n/file/'.$USER_ID.'/preview.jpg" width="50px"></td>';
			echo '<td>'.$user['name'].'</td>';
			echo '<td>'.$user['email'].'</td>';
			echo '<td>'.$user['locale'].'</td>';
			echo '</tr>';
		}
	}
	echo '</table>';
}

?>